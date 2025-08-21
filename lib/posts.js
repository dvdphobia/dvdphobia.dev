import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import readingTime from 'reading-time';
import { format } from 'date-fns';

const postsDirectory = path.join(process.cwd(), 'posts');

export async function getAllPosts() {
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
      const date = data.date ? format(new Date(data.date), 'yyyy-MM-dd') : '';
      return { slug, title: data.title || slug, excerpt, date, readingTime: rt };
    })
  );
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug) {
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
  const date = data.date ? format(new Date(data.date), 'yyyy-MM-dd') : '';
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
