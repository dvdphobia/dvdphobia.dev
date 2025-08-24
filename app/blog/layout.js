
import MonetagScripts from '../../components/MonetagScripts';


export const metadata = {
  title: 'Blog | dvdphobia.dev',
  description: 'Articles and posts',
};

// NOTE: Only the root layout should render <html>/<body>. This segment layout
// simply injects the Monetag scripts for all /blog pages.
export default function BlogLayout({ children }) {
  return (
    <>
  {/* Always load Monetag scripts unless globally disabled */}
  {process.env.NEXT_PUBLIC_DISABLE_ADS !== '1' && <MonetagScripts />}
      {children}
    </>
  );
}