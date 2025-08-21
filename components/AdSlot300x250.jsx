"use client";

import { useEffect, useRef } from 'react';

export default function AdSlot300x250() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Clear any previous content
    el.innerHTML = '';

    // Set global options expected by the ad network
    window.atOptions = {
      key: 'a03385a7d3e5a8dfccc9c6a372b6f8db',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {},
    };

    // Create the network script and append inside this container so it renders here
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = '//www.highperformanceformat.com/a03385a7d3e5a8dfccc9c6a372b6f8db/invoke.js';
    el.appendChild(s);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: 300, height: 250, overflow: 'hidden' }}
      aria-label="Ad slot 300x250"
    />
  );
}
