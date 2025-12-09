import './globals.css';
import Script from 'next/script';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'DVDphobia | Developer & Builder', template: '%s | DVDphobia' },
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
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gscVerification = process.env.GOOGLE_SITE_VERIFICATION;

  return (
    <html lang="en">
      <head>
        {/* Hotjar / Contentsquare */}
        <script src="https://t.contentsquare.net/uxa/17d0ad56f69ae.js" async />

        {/* TrustLogo loader */}
        <Script id="trustlogo-loader" strategy="beforeInteractive">{`
          var tlJsHost = (location.protocol === "https:") ? "https://secure.trust-provider.com/" : "http://www.trustlogo.com/";
          document.write(unescape("%3Cscript src='" + tlJsHost + "trustlogo/javascript/trustlogo.js' type='text/javascript'%3E%3C/script%3E"));
        `}</Script>

        {/* Google Search Console */}
        {gscVerification && <meta name="google-site-verification" content={gscVerification} />}

        {/* Google Analytics */}
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}
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

        {/* TrustLogo init */}
        <Script id="trustlogo-init" strategy="afterInteractive">{`
          TrustLogo("https://www.dvdphobia.dev/sectigo_trust_seal_sm_82x32.png", "CL1", "none");
        `}</Script>
        <a href="https://ssl.comodo.com/free-ssl-certificate.php" id="comodoTL" />
      </body>
    </html>
  );
}
