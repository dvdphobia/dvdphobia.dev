// Using native <img>; import Next Image when needed.

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
    <section>
      <h1>Portfolio</h1>
      <div className="grid grid-3">
        {projects.map((p) => (
          <a key={p.title} href={p.link} className="card" target="_blank" rel="noreferrer">
            <div
              style={{
                aspectRatio: '4/3',
                position: 'relative',
                marginBottom: 12,
                background: '#f6f6f6',
              }}
            >
              {}
              <img
                src={p.image}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h3>{p.title}</h3>
            <p className="muted">{p.summary}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
