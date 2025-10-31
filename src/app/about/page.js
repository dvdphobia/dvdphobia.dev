export const metadata = {
  title: 'About',
  description: 'About me and how to get in touch.',
  alternates: { canonical: '/about' },
};

import dynamic from 'next/dynamic';
const EmailLink = dynamic(() => import('@/components/common/EmailLink'), { ssr: false });

export default function AboutPage() {
  return (
    <section>
      <h1>About</h1>
      <p>
        I’m DVDphobia. Not my real name, but that’s what I want people to call me.
          
        I don’t really like talking much, but here’s a little about me. My name is Phanha. When I was around 9, I was just playing games like any kid. One day I started thinking, “how the fuck do people even make games?” That made me curious, so I started searching around. I found out people use programming. At that time, that word felt like some kind of magic to me.
          
        The first language I saw was C, and I fell in love with it. It’s close to machine language, and that makes it powerful as hell. Because of that, I started loving system stuff too. I spent a lot of time experimenting, messing with things, breaking systems, fucking up code—just to see what I could do.
          
        Oh, and one more thing: I love C, probably because I can’t read assembly., 
      </p>
      <p>
        Contact: <EmailLink user="me" domain="dvdphobia.dev" label="me@dvdphobia.dev" />
      </p>
    </section>
  );
}
