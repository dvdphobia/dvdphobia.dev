import fs from 'fs';
import path from 'path';

// This config is still used when you run the build script (next-sitemap) to output
// a static sitemap.xml. We've also added a dynamic sitemap route at app/sitemap.js
// which will auto-include new posts (including remote GitHub posts) without a rebuild.
/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  // For static generation we still include local posts; remote posts will be handled
  // dynamically via /sitemap.xml route if using the app router sitemap.js.
  additionalPaths: async () => {
    try {
      const postsDir = path.join(process.cwd(), 'posts');
      if (!fs.existsSync(postsDir)) return [];
      const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
      return files.map((f) => ({ loc: `/blog/${f.replace(/\.md$/, '')}` }));
    } catch {
      return [];
    }
  },
};

export default config;
