export const metadata = {
  title: 'About',
  description: 'Learn more about DVDphobia, a passionate programmer who loves C and system programming.',
  alternates: { canonical: '/about' },
};

import dynamic from 'next/dynamic';
const EmailLink = dynamic(() => import('@/components/common/EmailLink'), { ssr: false });

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section">
        <div className="container">
          <div style={{maxWidth: 700, margin: '0 auto'}}>
            <h1 style={{marginBottom: 24}}>About</h1>
            
            <div style={{lineHeight: 1.8, fontSize: '1.1rem'}}>
              <p style={{marginBottom: 24}}>
                I am DVDphobia. Not my real name, but that is what I want people to call me.
              </p>
              
              <p style={{marginBottom: 24}}>
                My real name is Phanha. When I was around 9, I was just playing games like any kid. 
                One day I started thinking, "how do people even make games?" That made me curious, 
                so I started searching around. I found out people use programming. At that time, 
                that word felt like some kind of magic to me.
              </p>
              
              <p style={{marginBottom: 24}}>
                The first language I saw was C, and I fell in love with it. It is close to machine language, 
                and that makes it powerful. Because of that, I started loving system stuff too. 
                I spent a lot of time experimenting, messing with things, breaking systems, 
                messing up code - just to see what I could do.
              </p>
              
              <p style={{marginBottom: 32}}>
                Oh, and one more thing: I love C, probably because I cannot read assembly.
              </p>
            </div>

            <hr style={{margin: '32px 0'}} />

            <div>
              <h2 style={{marginBottom: 16}}>Contact</h2>
              <p className="muted">
                <EmailLink user="me" domain="dvdphobia.dev" label="me@dvdphobia.dev" />
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
