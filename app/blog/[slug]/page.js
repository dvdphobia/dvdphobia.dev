import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '../../../lib/posts';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url,
    },
  };
}

export default async function PostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    description: post.excerpt,
    author: [{ '@type': 'Person', name: 'Your Name' }],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1>{post.title}</h1>
      <div className="muted" style={{marginBottom:16}}>
        <span>{post.date}</span> · <span>{post.readingTime?.text}</span>
      </div>
      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
