'use client';

export default function AuthorBox() {
  return (
    <div className="author-box">
      <div className="author-box-header">
        <div className="author-avatar">
          <span className="author-avatar-text">D</span>
        </div>
        <div className="author-info">
          <div className="author-name">Written by DVDphobia</div>
          <p className="author-tagline">
            System programmer who fell in love with C at 9. I build things and break systems.
          </p>
        </div>
      </div>
      
      <div className="author-links">
        <a href="/about" className="author-more-link">About me</a>
        <span className="author-separator">·</span>
        <a href="https://github.com/dvdphobia" target="_blank" rel="noopener noreferrer" className="author-social-link">GitHub</a>
        <span className="author-separator">·</span>
        <a href="https://twitter.com/dvdphobia" target="_blank" rel="noopener noreferrer" className="author-social-link">Twitter</a>
      </div>
    </div>
  );
}
