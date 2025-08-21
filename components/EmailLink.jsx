"use client";

import { useEffect, useRef } from 'react';

export default function EmailLink({ user, domain, label }) {
  const anchorRef = useRef(null);
  const text = label || `${user} [at] ${domain.replace(/\./g, ' [dot] ')}`;

  useEffect(() => {
    const a = anchorRef.current;
    if (!a) return;
    const address = `${user}@${domain}`;
    a.href = `mailto:${address}`;
  }, [user, domain]);

  return (
    <a ref={anchorRef} rel="nofollow noopener noreferrer">{text}</a>
  );
}
