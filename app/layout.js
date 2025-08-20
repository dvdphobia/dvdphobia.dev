export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Portfolio & Blog',
    template: '%s | Portfolio & Blog',
  },
  description: 'Clean black & white portfolio and blog built with Next.js and React.',
  openGraph: {
    title: 'Portfolio & Blog',
    description: 'Clean black & white portfolio and blog built with Next.js and React.',
    url: '/',
    siteName: 'Portfolio & Blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio & Blog',
    description: 'Clean black & white portfolio and blog built with Next.js and React.',
  },
  alternates: { canonical: '/' },
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Portfolio & Blog',
              url: process.env.SITE_URL || 'http://localhost:3000',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'DVDphobia',
              url: process.env.SITE_URL || 'http://localhost:3000',
            }),
          }}
        />
        <header>
          <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:16,paddingBottom:16}}>
            <a href="/" style={{fontWeight:700}}>PB</a>
            <nav>
              <a href="/" aria-current="page">Home</a>
              <a href="/blog">Blog</a>
              <a href="/portfolio">Portfolio</a>
              <a href="/about">About</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer>
          <div className="container" style={{paddingTop:16,paddingBottom:16}}>
            <p className="muted">© {new Date().getFullYear()} DVDphobia</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
