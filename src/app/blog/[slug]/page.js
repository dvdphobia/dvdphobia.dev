import { notFound } from 'next/navigation';
import React from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
const TOC = dynamic(() => import('@/components/blog/TOC'), { ssr: false });

const AdSlot300x250 = dynamic(() => import('@/components/ads/AdSlot300x250'), { ssr: false });
const AdSenseSlot = dynamic(() => import('@/components/ads/AdSenseSlot'), { ssr: false });

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

// Revalidate post pages to reflect upstream changes without a full rebuild
export const revalidate = 60; // seconds

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  // Use filename (slug) for the document <title>, keep frontmatter title displayed in content
  const docTitle = post.slug;
  return {
    title: docTitle,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: docTitle,
      description: post.excerpt,
      type: 'article',
      url,
    },
  };
}

export default async function PostPage({ params }) {
  if (!params || !params.slug) {
    notFound();
  }
  let post;
  try {
    post = await getPostBySlug(params.slug);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[post page] fetch error', e);
    }
  }
  if (!post) {
    notFound();
  }

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
      {/* AdSense base script (afterInteractive) only if client id is provided */}
      {process.env.NEXT_PUBLIC_DISABLE_ADS !== '1' && process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
        <Script
          id="adsense-base"
          strategy="afterInteractive"
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
        />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Left: Table of Contents */}
      <aside className="post-toc">
        <div className="toc-title">On this page</div>
        {post.headings && post.headings.length > 0 ? (
          <TOC headings={post.headings} />
        ) : (
          <p className="muted" style={{fontSize:14}}>No sections</p>
        )}
        <div style={{marginTop:16}}>
          <div className="muted" style={{fontSize:10,letterSpacing:1,textTransform:'uppercase'}}>Ad</div>
          {process.env.NEXT_PUBLIC_DISABLE_ADS !== '1' && (
            <AdSlot300x250 width={160} height={600} adKey="bfaf7d0aca6d3fc192fdefe76513881d" />
          )}
        </div>
      </aside>
      

      {/* Middle: Article */}
      <article className="post-main">
        <h1>{post.title}</h1>
        {/* Optional top ad (uncomment and set slot id) */}
        {/* <div style={{margin:'16px 0'}}><AdSenseSlot slot="YOUR_TOP_SLOT_ID" /></div> */}
        <div className="muted" style={{marginBottom:16}}>
          <span>{post.date}</span> · <span>{post.readingTime?.text}</span>
        </div>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        {/* Optional bottom ad (uncomment and set slot id) */}
        {/* <div style={{margin:'32px 0 0'}}><AdSenseSlot slot="YOUR_BOTTOM_SLOT_ID" /></div> */}
      </article>

      {/* Right: Author/About + Ad */}
      <aside className="post-aside">
        <div>
          <div className="card" style={{marginBottom:16}}>
            <div style={{fontWeight:700, marginBottom:8}}>About the author</div>
            <div style={{fontSize:14}}>
              <div style={{marginBottom:8}}>DVDphobia</div>
              <p className="muted" style={{marginTop:0}}>Engineer writing about web dev, performance, and practical UX.</p>
              <a href="/about" className="muted" style={{fontSize:14}}>More about me →</a>
            </div>
          </div>
          <div className="card ad" style={{marginBottom:16}}>
            <div className="muted" style={{fontSize:12, textTransform:'uppercase', letterSpacing:1}}>Advertisement</div>
            <div style={{marginTop:8, display:'flex', flexDirection:'column', alignItems:'center', gap:16}}>
              {process.env.NEXT_PUBLIC_DISABLE_ADS !== '1' && (
                <>
                  <AdSlot300x250 width={300} height={250} adKey="a03385a7d3e5a8dfccc9c6a372b6f8db" />
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
