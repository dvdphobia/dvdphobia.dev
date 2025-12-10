import { getAllPosts } from '@/lib/posts';

// Revalidate sitemap periodically so new remote posts appear without rebuild
export const revalidate = 1800; // 30 minutes

// Next.js (App Router) dynamic sitemap. Served at /sitemap.xml
export default async function sitemap() {
  // Remove trailing slash from SITE_URL to prevent double slashes
  const siteUrl = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

  // Core static routes you want indexed
  const staticRoutes = [
    '',
    'about',
    'blog',
    'portfolio',
  ].map((p) => ({
    url: p ? `${siteUrl}/${p}` : siteUrl,
    lastModified: new Date(),
  }));

  let posts = [];
  try {
    posts = await getAllPosts();
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[sitemap] failed to load posts:', e?.message || e);
    }
  }

  const postEntries = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug.replace(/^\/+/, '')}`,
    lastModified: p.date ? new Date(p.date) : new Date(),
  }));

  return [...staticRoutes, ...postEntries];
}
