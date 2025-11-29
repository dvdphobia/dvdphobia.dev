'use client';

import { useEffect, useRef } from 'react';

/**
 * Generic ad slot for the existing highperformanceformat network.
 * Single usage: pass width/height/adKey.
 * Multiple stacked usage: pass a `units` array of objects { width, height, adKey, format?, scriptSrc? }.
 * To avoid collisions with the global `window.atOptions`, multiple units load sequentially (promise chain)
 * so each script reads the correct options before the next overwrites them.
 */
export default function AdSlot300x250(props) {
  const {
    width = 300,
    height = 250,
    adKey = 'a03385a7d3e5a8dfccc9c6a372b6f8db',
    format = 'iframe',
    scriptSrc,
    style,
    className = '',
    label,
    units, // optional array for stacked ads
    gap = 16,
  } = props;

  // Single container ref OR array of refs for multiple units
  const singleRef = useRef(null);
  const multiRefs = useRef([]);
  if (units && units.length) {
    // ensure refs array length matches units length
    if (multiRefs.current.length !== units.length) {
      multiRefs.current = units.map((_, i) => multiRefs.current[i] || null);
    }
  }

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_ADS === '1') return; // skip loading scripts entirely
    // Helper to inject a script for one unit
    function loadUnit(
      el,
      { width: w, height: h, adKey: keyVal, format: fmt = 'iframe', scriptSrc: srcOverride }
    ) {
      return new Promise((resolve) => {
        if (!el) return resolve();
        el.innerHTML = '';
        const srcFinal = srcOverride || `//www.highperformanceformat.com/${keyVal}/invoke.js`;
        // Set global options (network relies on this)
        window.atOptions = { key: keyVal, format: fmt, height: h, width: w, params: {} };
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = srcFinal;
        s.onload = () => resolve();
        s.onerror = () => resolve();
        el.appendChild(s);
      });
    }

    // Global queue to ensure different component instances don't race on window.atOptions
    if (typeof window !== 'undefined') {
      if (!window.__adLoadQueue) window.__adLoadQueue = Promise.resolve();
      const chain = async () => {
        if (units && units.length) {
          // Sequential inside this component
          for (let i = 0; i < units.length; i++) {
            await loadUnit(multiRefs.current[i], units[i]);
          }
        } else {
          await loadUnit(singleRef.current, { width, height, adKey, format, scriptSrc });
        }
      };
      window.__adLoadQueue = window.__adLoadQueue.then(chain).catch(() => {});
    }
  }, [units, width, height, adKey, format, scriptSrc]);

  if (units && units.length) {
    if (process.env.NEXT_PUBLIC_DISABLE_ADS === '1') return null;
    return (
      <div className={className} style={style} aria-label={label || 'Ad group'}>
        {units.map((u, i) => (
          <div
            key={i}
            ref={(el) => (multiRefs.current[i] = el)}
            style={{
              width: u.width,
              height: u.height,
              overflow: 'hidden',
              marginBottom: i < units.length - 1 ? gap : 0,
            }}
            aria-label={`Ad slot ${u.width}x${u.height}`}
          />
        ))}
      </div>
    );
  }

  if (process.env.NEXT_PUBLIC_DISABLE_ADS === '1') return null;

  return (
    <div
      ref={singleRef}
      className={className}
      style={{ width, height, overflow: 'hidden', ...style }}
      aria-label={label || `Ad slot ${width}x${height}`}
    />
  );
}
