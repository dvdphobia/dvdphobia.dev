const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'inline', marginLeft: 4}}>
    <path d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Hi, I am DVDphobia</h1>
          <p>
            Developer. Writer. Builder. I love C, system programming, 
            and creating things that work.
          </p>
          <div style={{display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap'}}>
            <a href="/blog" className="btn btn-primary">
              Read the Blog
              <ArrowRightIcon />
            </a>
            <a href="/portfolio" className="btn btn-secondary">
              View Projects
            </a>
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="section" style={{paddingTop: 0}}>
        <div className="container">
          <div className="screenshot-frame" style={{maxWidth: 600, margin: '0 auto'}}>
            <div style={{
              background: '#171717',
              borderRadius: 10,
              padding: '24px 32px',
            }}>
              <div style={{
                display: 'flex',
                gap: 8,
                marginBottom: 16,
              }}>
                <div style={{width: 12, height: 12, borderRadius: '50%', background: '#ef4444'}}></div>
                <div style={{width: 12, height: 12, borderRadius: '50%', background: '#f59e0b'}}></div>
                <div style={{width: 12, height: 12, borderRadius: '50%', background: '#22c55e'}}></div>
              </div>
              <div style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: 14,
                color: '#22c55e',
                lineHeight: 1.6,
              }}>
                <div style={{color: '#737373'}}>// Hello, World!</div>
                <div><span style={{color: '#a855f7'}}>const</span> me = {'{'}</div>
                <div style={{paddingLeft: 20}}>name: <span style={{color: '#f59e0b'}}>"DVDphobia"</span>,</div>
                <div style={{paddingLeft: 20}}>loves: [<span style={{color: '#f59e0b'}}>"C"</span>, <span style={{color: '#f59e0b'}}>"Systems"</span>],</div>
                <div style={{paddingLeft: 20}}>building: <span style={{color: '#f59e0b'}}>"cool stuff"</span></div>
                <div>{'};'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="grid grid-3">
            <a className="card" href="/blog">
              <h3 style={{marginBottom: 8}}>Blog</h3>
              <p className="muted" style={{margin: 0, fontSize: 14}}>
                Technical notes, deep dives, and project updates.
              </p>
            </a>
            <a className="card" href="/portfolio">
              <h3 style={{marginBottom: 8}}>Portfolio</h3>
              <p className="muted" style={{margin: 0, fontSize: 14}}>
                A curated set of professional and personal work.
              </p>
            </a>
            <a className="card" href="/about">
              <h3 style={{marginBottom: 8}}>About</h3>
              <p className="muted" style={{margin: 0, fontSize: 14}}>
                Background, skills, and how to get in touch.
              </p>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
