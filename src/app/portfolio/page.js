export const metadata = {
  title: 'Portfolio',
  description: 'Selected projects and case studies.',
  alternates: { canonical: '/portfolio' },
};

const projects = [
  {
    title: 'Project Alpha',
    summary: 'High-performance web app with real-time features.',
    link: 'https://example.com',
    image: 'https://picsum.photos/seed/alpha/800/600',
  },
  {
    title: 'Project Beta',
    summary: 'E-commerce storefront focused on speed and UX.',
    link: 'https://example.com',
    image: 'https://picsum.photos/seed/beta/800/600',
  },
  {
    title: 'Project Gamma',
    summary: 'Data visualization dashboard for insights at a glance.',
    link: 'https://example.com',
    image: 'https://picsum.photos/seed/gamma/800/600',
  },
];

export default function PortfolioPage() {
  return (
    <>
      <section className="section">
        <div className="container">
          <h1 style={{marginBottom: 16}}>Portfolio</h1>
          <p className="muted" style={{marginBottom: 48, maxWidth: 600}}>
            A curated collection of projects I have worked on.
          </p>
          
          <div className="grid grid-3">
            {projects.map((p) => (
              <a 
                key={p.title} 
                href={p.link} 
                className="card" 
                target="_blank" 
                rel="noreferrer"
                style={{padding: 0, overflow: 'hidden'}}
              >
                <div style={{
                  aspectRatio: '4/3',
                  position: 'relative',
                  background: 'var(--surface)',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={p.image} 
                    alt="" 
                    style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                  />
                </div>
                <div style={{padding: 20}}>
                  <h3 style={{margin: 0, marginBottom: 8}}>{p.title}</h3>
                  <p className="muted" style={{margin: 0, fontSize: 14}}>{p.summary}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
