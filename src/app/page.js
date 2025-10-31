export default function HomePage() {
  return (
    <section>
      <h1>Hi, I’m DVDphobia.</h1>
      <p className="muted">Developer. Writer. Builder. This is my minimalist portfolio and blog. </p>
      <hr />
      <div className="grid grid-3">
        <a className="card" href="/blog">
          <h3>Read the Blog →</h3>
          <p className="muted">Technical notes, deep dives, and project updates.</p>
        </a>
        <a className="card" href="/portfolio">
          <h3>See Projects →</h3>
          <p className="muted">A curated set of professional and personal work.</p>
        </a>
        <a className="card" href="/service">
          <h3>Service →</h3>
          <p className="muted">---</p>
        </a>
        <a className="card" href="/about">
          <h3>About Me →</h3>
          <p className="muted">Background, skills, and how to get in touch.</p>
        </a>
      </div>
    </section>
  );
}
