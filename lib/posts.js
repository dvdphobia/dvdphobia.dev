import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import * as tar from 'tar';
import { Readable } from 'node:stream';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import readingTime from 'reading-time';
import { format } from 'date-fns';

// Remote (GitHub) source configuration via environment variables
// Set POSTS_GITHUB_REPO to "owner/repo" to enable remote posts.
const GH_REPO = process.env.POSTS_GITHUB_REPO || '';
const GH_DIR = process.env.POSTS_GITHUB_DIR || 'posts';
const GH_REF = process.env.POSTS_GITHUB_REF || 'main';
const GH_TOKEN = process.env.POSTS_GITHUB_TOKEN || '';
const USE_REMOTE = GH_REPO.trim().length > 0;
const REMOTE_ONLY = (process.env.POSTS_REMOTE_ONLY || '').toLowerCase() === 'true';

// Tiny in-memory cache to avoid hammering APIs during dev/runtime
const cache = {
  list: null, // array of { slug, title, excerpt, date, readingTime }
  posts: new Map(), // slug -> full post object
  errors: new Map(), // slug -> ts for last failure to avoid hammering when rate-limited
  ts: 0,
};
const TTL_ENV = parseInt(process.env.POSTS_CACHE_TTL_SECONDS || '', 10);
const TTL = Number.isFinite(TTL_ENV)
  ? Math.max(0, TTL_ENV) * 1000
  : 60 * 1000; // default 60s

const postsDirectory = path.join(process.cwd(), 'posts');

function normalizeDate(d) {
  try {
    return d ? format(new Date(d), 'yyyy-MM-dd') : '';
  } catch {
    return '';
  }
}

function parsePostFromContent(slug, raw) {
  const { data, content } = matter(raw);
  const excerpt = data.excerpt || content.split('\n').slice(0, 3).join(' ');
  const rt = readingTime(content);
  const date = normalizeDate(data.date);
  const title = data.title || slug;
  return { slug, title, excerpt, date, readingTime: rt, data, content };
}

async function fetchGitHubJSON(url, accept) {
  const headers = {
    'User-Agent': 'dvdphobia.dev-site',
    'Accept': accept || 'application/vnd.github+json',
  };
  if (GH_TOKEN) headers.Authorization = `Bearer ${GH_TOKEN}`;
  const res = await fetch(url, { headers, cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`GitHub fetch failed: ${res.status} ${res.statusText} for ${url}`);
  }
  if (accept === 'application/vnd.github.raw') {
    return res.text();
  }
  return res.json();
}

async function listGitHubMarkdownFiles() {
  // Use the trees API for a single recursive listing
  const url = `https://api.github.com/repos/${GH_REPO}/git/trees/${encodeURIComponent(GH_REF)}?recursive=1`;
  try {
    const data = await fetchGitHubJSON(url);
    const prefix = GH_DIR.replace(/^\/+|\/+$/g, '');
    const base = prefix.length ? `${prefix}/` : '';
    const tree = Array.isArray(data?.tree) ? data.tree : [];
    const files = tree
      .filter((node) => node.type === 'blob' && node.path && node.path.startsWith(base) && /\.md$/.test(node.path))
      .map((node) => node.path);
    if (files.length) return files;
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[posts] Trees API failed, falling back to tarball:', e?.message || e);
    }
  }
  // Fallback: download tarball and list markdown files under GH_DIR
  const tarUrl = `https://codeload.github.com/${GH_REPO}/tar.gz/${encodeURIComponent(GH_REF)}`;
  const res = await fetch(tarUrl, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Tarball fetch failed: ${res.status} ${res.statusText}`);
  }
  const wantedDir = GH_DIR.replace(/^\/+|\/+$/g, '');
  const found = [];
  await new Promise((resolve, reject) => {
    const parser = tar.t({
      gzip: true,
      onentry: (entry) => {
        const p = entry.path || '';
        // Strip the root folder (like repo-ref/)
        const idx = p.indexOf('/');
        const rel = idx >= 0 ? p.slice(idx + 1) : p;
        if (rel.startsWith(wantedDir + '/') && /\.md$/.test(rel)) {
          found.push(rel);
        }
        entry.resume();
      },
    });
    parser.on('error', reject);
    parser.on('end', resolve);
    const nodeStream = Readable.fromWeb(res.body);
    nodeStream.on('error', reject);
    nodeStream.pipe(parser);
  });
  return found;
}

async function fetchGitHubFileRaw(filePath) {
  // If token provided (private repo or higher limits), use API raw accept
  if (GH_TOKEN) {
    const url = `https://api.github.com/repos/${GH_REPO}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(GH_REF)}`;
    const raw = await fetchGitHubJSON(url, 'application/vnd.github.raw');
    return raw;
  }
  // Otherwise, use the raw.githubusercontent.com endpoint (public repos only)
  const cleaned = filePath.replace(/^\/+/, '');
  const url = `https://raw.githubusercontent.com/${GH_REPO}/${GH_REF}/${cleaned}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Raw fetch failed: ${res.status} ${res.statusText} for ${url}`);
  }
  return res.text();
}

async function getRemoteAllPosts() {
  // cache check
  if (cache.list && Date.now() - cache.ts < TTL) {
    return cache.list;
  }
  const files = await listGitHubMarkdownFiles();
  if (!files.length && process.env.NODE_ENV !== 'production') {
    console.warn(`[posts] No markdown files found in ${GH_REPO}/${GH_DIR} at ref ${GH_REF}.`);
  }
  const posts = await Promise.all(
    files.map(async (filePath) => {
      const slug = path.basename(filePath).replace(/\.md$/, '');
      const raw = await fetchGitHubFileRaw(filePath);
      const parsed = parsePostFromContent(slug, raw);
      return { slug: parsed.slug, title: parsed.title, excerpt: parsed.excerpt, date: parsed.date, readingTime: parsed.readingTime };
    })
  );
  const sorted = posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  cache.list = sorted;
  cache.ts = Date.now();
  return sorted;
}

async function getRemotePostBySlug(slug) {
  // cache check
  if (cache.posts.has(slug) && Date.now() - cache.ts < TTL) {
    return cache.posts.get(slug);
  }
  // if recently failed (e.g., rate limited), avoid hammering
  const lastErrTs = cache.errors.get(slug);
  if (lastErrTs && Date.now() - lastErrTs < TTL) {
    return null;
  }
  const filePath = `${GH_DIR}/${slug}.md`;
  try {
    const raw = await fetchGitHubFileRaw(filePath);
    const parsed = parsePostFromContent(slug, raw);
    const headings = [];
  const processor = remark()
      // collect headings and assign ids so the HTML serializer outputs anchor targets
      .use(() => (tree) => {
        visit(tree, 'heading', (node) => {
          const depth = node.depth || 0;
          const text = toString(node);
          const id = (node?.data && (node.data.hProperties?.id || node.data.id)) ||
            text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
          // ensure id on the node for remark-html
          node.data = node.data || {};
          node.data.hProperties = { ...(node.data.hProperties || {}), id };
          if (depth >= 2 && depth <= 3) {
            headings.push({ depth, text, id });
          }
        });
  })
  .use(remarkRehype)
  .use(rehypeStringify);
    const processedContent = await processor.process(parsed.content);
    const contentHtml = processedContent.toString();
    const post = {
      slug: parsed.slug,
      title: parsed.title,
      excerpt: parsed.excerpt,
      date: parsed.date,
      readingTime: parsed.readingTime,
      contentHtml,
      headings,
    };
    cache.posts.set(slug, post);
    cache.ts = Date.now();
    return post;
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[posts] Failed to fetch remote post ${filePath}:`, e?.message || e);
    }
  cache.errors.set(slug, Date.now());
    return null;
  }
}

export async function getAllPosts() {
  // Prefer remote if configured; gracefully fall back to local files
  if (USE_REMOTE) {
    try {
      return await getRemoteAllPosts();
    } catch (e) {
  if (REMOTE_ONLY) return [];
  // fall through to local when not remote-only
    }
  }
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));
  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const excerpt = data.excerpt || content.split('\n').slice(0, 3).join(' ');
      const rt = readingTime(content);
      const date = normalizeDate(data.date);
  return { slug, title: data.title || slug, excerpt, date, readingTime: rt };
    })
  );
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug) {
  if (USE_REMOTE) {
    const remote = await getRemotePostBySlug(slug);
  if (remote) return remote;
  if (REMOTE_ONLY) return null;
  // else fall back to local when not remote-only
  }
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const headings = [];
  const processor = remark()
    // collect headings and assign ids so the HTML serializer outputs anchor targets
    .use(() => (tree) => {
      visit(tree, 'heading', (node) => {
        const depth = node.depth || 0;
        const text = toString(node);
        const id = (node?.data && (node.data.hProperties?.id || node.data.id)) ||
          text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
        // ensure id on the node for remark-html
        node.data = node.data || {};
        node.data.hProperties = { ...(node.data.hProperties || {}), id };
        if (depth >= 2 && depth <= 3) {
          headings.push({ depth, text, id });
        }
      });
  })
  .use(remarkRehype)
  .use(rehypeStringify);
  const processedContent = await processor.process(content);
  const contentHtml = processedContent.toString();
  const rt = readingTime(content);
  const date = normalizeDate(data.date);
  return {
    slug,
  title: data.title || slug,
    excerpt: data.excerpt || content.split('\n').slice(0, 3).join(' '),
    date,
    readingTime: rt,
    contentHtml,
    headings,
  };
}
