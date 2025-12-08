import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

const REVALIDATE_SECONDS = Number.parseInt(process.env.POSTS_CACHE_TTL_SECONDS || '60', 10) || 60;
export const revalidate = REVALIDATE_SECONDS;

export const metadata = {
  title: 'Blog',
  description: 'Articles, tutorials, and notes.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <>
      <section className="section">
        <div className="container">
          <div style={{maxWidth: 700, margin: '0 auto'}}>
            <h1 style={{marginBottom: 16}}>Blog</h1>
            <p className="muted" style={{marginBottom: 48}}>
              Technical notes, deep dives, and project updates.
            </p>
            
            {posts.length === 0 ? (
              <p className="muted">No posts yet. Check back soon!</p>
            ) : (
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                {posts.map(p => (
                  <li key={p.slug} style={{marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--border)'}}>
                    <Link href={`/blog/${p.slug}`}>
                      <h2 style={{fontSize: '1.25rem', marginBottom: 8}}>{p.title}</h2>
                    </Link>
                    <div className="muted" style={{fontSize: 14, marginBottom: 8}}>
                      <span>{p.date}</span>
                      {p.readingTime?.text && <span> · {p.readingTime.text}</span>}
                    </div>
                    {p.excerpt && (
                      <p className="muted" style={{margin: 0}}>{p.excerpt}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
