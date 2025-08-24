"use client";
import { useEffect, useState, useRef } from 'react';

/**
 * Table of Contents with:
 * - Truncated (clamped) long heading titles (show full text on hover via title attr)
 * - Scroll-spy highlighting of currently visible section
 * - Smooth scrolling behavior
 */
export default function TOC({ headings = [] }) {
  const [active, setActive] = useState(null);
  const [showSub, setShowSub] = useState(false); // collapse h3 by default
  const observerRef = useRef(null);

  useEffect(() => {
    if (!headings.length) return;
    const opts = { root: null, rootMargin: '0px 0px -60% 0px', threshold: [0, 1] };
    const cb = (entries) => {
      // Pick the first intersecting entry (closest to top)
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
      if (visible.length) {
        setActive(visible[0].target.id);
      } else {
        // Fallback: find the last heading above the viewport
        const tops = headings.map(h => {
          const el = document.getElementById(h.id);
            if (!el) return { id: h.id, top: Infinity };
            return { id: h.id, top: el.getBoundingClientRect().top };
        }).filter(o => o.top < 80).sort((a,b) => b.top - a.top);
        if (tops.length) setActive(tops[0].id);
      }
    };
    const obs = new IntersectionObserver(cb, opts);
    observerRef.current = obs;
    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => { obs.disconnect(); };
  }, [headings]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    // Smooth scroll with offset compensation (header height ~0 but keep margin)
    const y = el.getBoundingClientRect().top + window.scrollY - 10; // slight offset
    window.history.replaceState(null, '', `#${id}`);
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const hasH3 = headings.some(h => h.depth === 3);
  const visible = headings.filter(h => showSub ? true : h.depth <= 2);

  return (
    <>
      <ul className="toc-list">
        {visible.map(h => {
          const truncated = h.text.length > 100 ? h.text.slice(0, 97) + '…' : h.text; // safety truncation pre-clamp for perf
          return (
            <li key={h.id} className={`d${h.depth}`}>
              <a
                href={`#${h.id}`}
                onClick={(e) => handleClick(e, h.id)}
                title={h.text}
                className={active === h.id ? 'active' : undefined}
              >
                {truncated}
              </a>
            </li>
          );
        })}
      </ul>
      {hasH3 && (
        <button type="button" className="toc-toggle" onClick={() => setShowSub(s => !s)}>
          {showSub ? 'Hide subsections' : 'Show subsections'}
        </button>
      )}
    </>
  );
}
