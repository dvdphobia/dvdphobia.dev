import './globals.css';
import Script from 'next/script';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true, // Preload primary font
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false, // Defer monospace font (used less frequently)
  fallback: ['Consolas', 'Monaco', 'monospace'],
});

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(SITE_URL.replace(/\/+$/, '')),
  title: { default: 'DVDphobia | Developer & Builder', template: '%s | DVDphobia' },
  description: 'Clean, modern portfolio and blog. Developer, Writer, Builder.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'DVDphobia | Developer & Builder',
    description: 'Clean, modern portfolio and blog. Developer, Writer, Builder.',
    url: '/',
    siteName: 'DVDphobia',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DVDphobia | Developer & Builder',
    description: 'Clean, modern portfolio and blog. Developer, Writer, Builder.',
  },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gscVerification = process.env.GOOGLE_SITE_VERIFICATION;

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Inline critical CSS for instant render */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root{--bg:#fff;--fg:#111;--muted:#666;--border:#e0e0e0;--primary:#111;--surface:#f8f8f8}
          *{box-sizing:border-box}
          html{scroll-behavior:smooth;height:auto}
          body{margin:0;font-family:var(--font-inter),system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--fg);line-height:1.7;min-height:100vh;display:flex;flex-direction:column;-webkit-font-smoothing:antialiased}
          .site-header{background:rgba(255,255,255,.95);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;backdrop-filter:blur(12px)}
          .header-container{max-width:1200px;margin:0 auto;padding:16px 24px;display:flex;justify-content:space-between;align-items:center}
          .container{max-width:1200px;margin:0 auto;padding:24px}
        `}} />
        
        {/* Resource hints for external domains */}
        <link rel="dns-prefetch" href="https://t.contentsquare.net" />
        <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />
        <link rel="preconnect" href="https://t.contentsquare.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://static.cloudflareinsights.com" crossOrigin="anonymous" />

        {/* Google Search Console */}
        {gscVerification && <meta name="google-site-verification" content={gscVerification} />}

        {/* Defer non-critical analytics to after interactive */}
        {gaId && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.google-analytics.com" />
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}

        {/* ContentSquare - Load with worker strategy for better performance */}
        <Script 
          src="https://t.contentsquare.net/uxa/17d0ad56f69ae.js" 
          strategy="worker"
        />
      </head>

      <body>
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'WebSite', name: 'DVDphobia', url: SITE_URL
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Person', name: 'DVDphobia', url: SITE_URL
        })}} />

        <Header />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
