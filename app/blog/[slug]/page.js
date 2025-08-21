import { notFound } from 'next/navigation';
import Script from 'next/script';
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
    author: [{ '@type': 'Person', name: 'DVDphobia' }],
  };

  return (
    <div className="post-layout">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Left: Table of Contents */}
      <aside className="post-toc">
        <div className="sticky">
          <div className="toc-title">On this page</div>
          {post.headings && post.headings.length > 0 ? (
            <ul>
              {post.headings.map((h) => (
                <li key={h.id} className={`d${h.depth}`}>
                  <a href={`#${h.id}`}>{h.text}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted" style={{fontSize:14}}>No sections</p>
          )}
        </div>
      </aside>

      {/* Middle: Article */}
      <article className="post-main">
        <h1>{post.title}</h1>
        <div className="muted" style={{marginBottom:16}}>
          <span>{post.date}</span> · <span>{post.readingTime?.text}</span>
        </div>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>

      {/* Right: Author/About + Ad */}
      <aside className="post-aside">
        <div className="sticky">
          <div className="card" style={{marginBottom:16}}>
            <div style={{fontWeight:700, marginBottom:8}}>About the author</div>
            <div style={{fontSize:14}}>
              <div style={{marginBottom:8}}>DVDphobia</div>
              <p className="muted" style={{marginTop:0}}>Engineer writing about web dev, performance, and practical UX.</p>
              <a href="/about" className="muted" style={{fontSize:14}}>More about me →</a>
            </div>
          </div>
          <div className="card ad">
            <div className="muted" style={{fontSize:12, textTransform:'uppercase', letterSpacing:1}}>Advertisement</div>
            <div style={{width:300, height:250, marginTop:8}}>
              <Script id="ad-atoptions" strategy="afterInteractive" dangerouslySetInnerHTML={{
                __html: `atOptions = { key: 'a03385a7d3e5a8dfccc9c6a372b6f8db', format: 'iframe', height: 250, width: 300, params: {} };`
              }} />
              <Script id="ad-invoke" strategy="afterInteractive" src="https://www.highperformanceformat.com/a03385a7d3e5a8dfccc9c6a372b6f8db/invoke.js" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
