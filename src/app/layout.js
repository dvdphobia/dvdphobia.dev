export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'DVDphobia | Developer & Builder',
    template: '%s | DVDphobia',
  },
  description: 'Clean, modern portfolio and blog. Developer, Writer, Builder.',
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
        {/* Hotjar */}
        <script src="https://t.contentsquare.net/uxa/17d0ad56f69ae.js"></script>
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
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'DVDphobia',
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
          <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:20,paddingBottom:20}}>
            <a href="/" style={{fontWeight:700,fontSize:'1.25rem',letterSpacing:'-0.02em'}}>
              DVDphobia
            </a>
            <nav style={{display:'flex',alignItems:'center'}}>
              <a href="/">Home</a>
              <a href="/blog">Blog</a>
              <a href="/portfolio">Portfolio</a>
              <a href="/about">About</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer>
          <div className="container" style={{paddingTop:32,paddingBottom:32,textAlign:'center'}}>
            <p className="muted" style={{fontSize:14,margin:0}}>© {new Date().getFullYear()} DVDphobia</p>
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
