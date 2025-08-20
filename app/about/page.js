export const metadata = {
  title: 'About',
  description: 'About me and how to get in touch.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <section>
      <h1>About</h1>
      <p>
        I build performant, accessible web apps with a focus on clean UX and
        pragmatic engineering. This site is a simple, fast, and SEO-friendly
        place for my notes and work.
      </p>
      <p>
        Contact: <a href="mailto:you@example.com">you@example.com</a>
      </p>
    </section>
  );
}
