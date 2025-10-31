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
  other: {
    monetag: '66792c6ca3c30204d166d9b416c857d7'
  }
};

import './globals.css';
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* If hosted on Cloudflare, consider disabling 'Email Address Obfuscation' to avoid /cdn-cgi/l/email-protection URLs */}
        {/* TrustLogo loader script (in head) */}
        <Script id="trustlogo-loader" strategy="beforeInteractive" dangerouslySetInnerHTML={{
          __html: `//<![CDATA[
var tlJsHost = ((window.location.protocol == "https:") ? "https://secure.trust-provider.com/" : "http://www.trustlogo.com/");
document.write(unescape("%3Cscript src='" + tlJsHost + "trustlogo/javascript/trustlogo.js' type='text/javascript'%3E%3C/script%3E"));
//]]>`
        }} />
        {/* Google Search Console verification (set GOOGLE_SITE_VERIFICATION env var) */}
        {process.env.GOOGLE_SITE_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.GOOGLE_SITE_VERIFICATION} />
        )}
        
      </head>
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
          <div className="container" style={{paddingTop:16,paddingBottom:16, justifyContent:'center', display:'flex'}}>
            <p className="muted">© {new Date().getFullYear()} DVDphobia</p>
          </div>
        </footer>
        {/* TrustLogo init (before body end) and anchor */}
        <Script id="trustlogo-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `TrustLogo("https://www.dvdphobia.dev/sectigo_trust_seal_sm_82x32.png", "CL1", "none");`
        }} />
        <a href="https://ssl.comodo.com/free-ssl-certificate.php" id="comodoTL"></a>

        
      </body>
    </html>
  );
}
