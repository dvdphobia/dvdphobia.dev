import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
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
  ts: 0,
};
const TTL = process.env.NODE_ENV === 'development' ? 5 * 60 * 1000 : 60 * 60 * 1000; // 5m dev, 1h prod

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
  // GET contents of directory
  const url = `https://api.github.com/repos/${GH_REPO}/contents/${encodeURIComponent(GH_DIR)}?ref=${encodeURIComponent(GH_REF)}`;
  const items = await fetchGitHubJSON(url);
  if (!Array.isArray(items)) return [];
  return items.filter((it) => it.type === 'file' && /\.md$/.test(it.name));
}

async function fetchGitHubFileRaw(filePath) {
  // Prefer API with raw accept header to support private repos
  const url = `https://api.github.com/repos/${GH_REPO}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(GH_REF)}`;
  const raw = await fetchGitHubJSON(url, 'application/vnd.github.raw');
  return raw;
}

async function getRemoteAllPosts() {
  // cache check
  if (cache.list && Date.now() - cache.ts < TTL) {
    return cache.list;
  }
  const files = await listGitHubMarkdownFiles();
  const posts = await Promise.all(
    files.map(async (f) => {
      const slug = f.name.replace(/\.md$/, '');
      const filePath = `${GH_DIR}/${f.name}`;
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
      .use(html);
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
    .use(html);
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
