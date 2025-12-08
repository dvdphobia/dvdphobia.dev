export const metadata = {
  title: 'Portfolio',
  description: 'Selected projects and case studies.',
  alternates: { canonical: '/portfolio' },
};

// Set to true when you have real projects to show
const SHOW_PROJECTS = false;

const projects = [
  // Add your real projects here when ready:
  // {
  //   title: 'Project Name',
  //   summary: 'Brief description of the project.',
  //   link: 'https://your-project.com',
  //   image: '/images/project.png', // Use local images
  // },
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
          
          {!SHOW_PROJECTS || projects.length === 0 ? (
            <div className="portfolio-coming-soon">
              <div style={{fontSize: 48, marginBottom: 16}}>🚧</div>
              <h2>Coming Soon</h2>
              <p>I&apos;m currently working on documenting my projects. Check back soon!</p>
            </div>
          ) : (
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
          )}
        </div>
      </section>
    </>
  );
}
