import Link from 'next/link';
import { getAllPosts } from '../../lib/posts';

export const metadata = {
  title: 'Blog',
  description: 'Articles, tutorials, and notes.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <section>
      <h1>Blog</h1>
      <ul style={{listStyle:'none',padding:0}}>
        {posts.map(p => (
          <li key={p.slug} style={{marginBottom:16}}>
            <Link href={`/blog/${p.slug}`}>
              <strong>{p.title}</strong>
            </Link>
            <div className="muted" style={{fontSize:14}}>
              <span>{p.date}</span> · <span>{p.readingTime?.text}</span>
            </div>
            <p className="muted">{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
