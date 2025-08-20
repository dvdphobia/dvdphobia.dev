import fs from 'fs';
import path from 'path';

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  additionalPaths: async () => {
    const postsDir = path.join(process.cwd(), 'posts');
    if (!fs.existsSync(postsDir)) return [];
    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
    return files.map((f) => ({ loc: `/blog/${f.replace(/\.md$/, '')}` }));
  },
};

export default config;
