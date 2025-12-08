import { notFound } from 'next/navigation';
import React from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
const TOC = dynamic(() => import('@/components/blog/TOC'), { ssr: false });
const AuthorBox = dynamic(() => import('@/components/blog/AuthorBox'), { ssr: false });

const AdSlot = dynamic(() => import('@/components/ads/Ads').then(mod => ({ default: mod.AdSlot })), { ssr: false });
const AdSense = dynamic(() => import('@/components/ads/Ads').then(mod => ({ default: mod.AdSense })), { ssr: false });

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
      
      {/* Left: Table of Contents (clean, no ads) */}
      <aside className="post-toc">
        <div className="toc-content">
          <div className="toc-title">On this page</div>
          {post.headings && post.headings.length > 0 ? (
            <TOC headings={post.headings} />
          ) : (
            <p className="muted" style={{fontSize:14}}>No sections</p>
          )}
        </div>
      </aside>

      {/* Main Article */}
      <article className="post-main">
        <div className="post-header">
          <h1>{post.title}</h1>
          <div className="post-meta muted">
            <span>{post.date}</span> · <span>{post.readingTime?.text}</span>
          </div>
        </div>
        
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        
        {/* Single ad placement - after content, before author */}
        {process.env.NEXT_PUBLIC_DISABLE_ADS !== '1' && (
          <div className="post-ad">
            <AdSlot width={728} height={90} adKey="a03385a7d3e5a8dfccc9c6a372b6f8db" />
          </div>
        )}
        
        {/* Author Box */}
        <AuthorBox />
      </article>
    </div>
  );
}
