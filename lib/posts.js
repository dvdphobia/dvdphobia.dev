import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
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
  const processedContent = await remark().use(html).process(content);
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
  };
}
