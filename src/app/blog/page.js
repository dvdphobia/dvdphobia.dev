import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

const REVALIDATE_SECONDS = Number.parseInt(process.env.POSTS_CACHE_TTL_SECONDS || '60', 10) || 60;
export const revalidate = REVALIDATE_SECONDS;

export const metadata = {
  title: 'Blog',
  description: 'Articles, tutorials, and notes on programming, systems, and technology.',
  alternates: { canonical: '/blog' },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Blog | DVDphobia',
    description: 'Articles, tutorials, and notes on programming, systems, and technology.',
    url: '/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Blog | DVDphobia',
    description: 'Articles, tutorials, and notes on programming, systems, and technology.',
  },
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
              <ul className="blog-list">
                {posts.map(p => (
                  <li key={p.slug} className="blog-list-item">
                    <Link href={`/blog/${p.slug}`} className="blog-list-link">
                      <h2 className="blog-list-title">{p.title}</h2>
                      <div className="blog-list-meta muted">
                        <span>{p.date}</span>
                        {p.readingTime?.text && <span> · {p.readingTime.text}</span>}
                      </div>
                      {p.excerpt && (
                        <p className="blog-list-excerpt muted">{p.excerpt}</p>
                      )}
                    </Link>
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
