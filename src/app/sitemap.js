import { getAllPosts } from '@/lib/posts';

export const revalidate = 1800; // re-generate every 30 minutes

export default async function sitemap() {
  const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';

  const staticRoutes = ['/', '/about', '/blog'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  let posts = [];
  try {
    posts = await getAllPosts();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[sitemap] failed to load posts:', err?.message ?? err);
    }
  }

  const postEntries = posts.map(({ slug, date }) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified: date ? new Date(date) : new Date(),
  }));

  return [...staticRoutes, ...postEntries];
}
