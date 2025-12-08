"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Script from 'next/script';

const DISABLE_ADS = process.env.NEXT_PUBLIC_DISABLE_ADS === '1';

// ============================================
// AdSense Slot
// ============================================
export function AdSense({ slot, format = 'auto', className = '', style }) {
  const ref = useRef(null);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client || !slot || DISABLE_ADS) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [client, slot]);

  if (!client || !slot || DISABLE_ADS) return null;

  return (
    <ins
      ref={ref}
      className={`adsbygoogle ${className}`.trim()}
      style={style || { display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}

// ============================================
// HighPerformanceFormat Ad Slot
// ============================================
export function AdSlot({
  width = 300,
  height = 250,
  adKey = 'a03385a7d3e5a8dfccc9c6a372b6f8db',
  format = 'iframe',
  scriptSrc,
  style,
  className = '',
  label,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (DISABLE_ADS || !ref.current) return;

    const el = ref.current;
    el.innerHTML = '';

    const src = scriptSrc || `//www.highperformanceformat.com/${adKey}/invoke.js`;
    window.atOptions = { key: adKey, format, height, width, params: {} };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;
    el.appendChild(script);
  }, [width, height, adKey, format, scriptSrc]);

  if (DISABLE_ADS) return null;

  return (
    <div
      ref={ref}
      className={className}
      style={{ width, height, overflow: 'hidden', ...style }}
      aria-label={label || `Ad slot ${width}x${height}`}
    />
  );
}

// ============================================
// Monetag Scripts
// ============================================
export function MonetagScripts() {
  if (DISABLE_ADS) return null;

  return (
    <Script
      id="monetag-tag"
      src="//madurird.com/tag.min.js"
      data-zone="9760287"
      data-cfasync="false"
      strategy="afterInteractive"
    />
  );
}

// ============================================
// Monetag with Opt-In Gate
// ============================================
export function MonetagOptIn({ position = 'sidebar' }) {
  const auto = process.env.NEXT_PUBLIC_MONETAG_AUTO === '1';
  const [enabled, setEnabled] = useState(auto);
  const [dismissed, setDismissed] = useState(false);

  const enable = useCallback(() => setEnabled(true), []);
  const disable = useCallback(() => { setEnabled(false); setDismissed(true); }, []);

  if (DISABLE_ADS) return null;

  if (enabled) {
    return (
      <>
        <MonetagScripts />
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--muted)' }}>
          Ads enabled
          <button onClick={disable} style={btnStyle}>Disable (page)</button>
        </div>
      </>
    );
  }

  if (dismissed) return null;

  return (
    <div className={`monetag-optin monetag-optin-${position}`} style={{ marginTop: 12 }}>
      <div style={{ fontSize: 12, lineHeight: 1.4, marginBottom: 6 }}>
        Support this site by enabling ads. You can turn it off anytime.
      </div>
      <button onClick={enable} style={btnPrimary}>Enable Ads</button>
      <button onClick={() => setDismissed(true)} style={btnGhost}>No thanks</button>
    </div>
  );
}

// Button styles
const btnBase = {
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 12,
  padding: '6px 10px',
  borderRadius: 4,
  border: '1px solid var(--border)',
  background: 'transparent',
};

const btnPrimary = { ...btnBase, background: '#111', color: '#fff', borderColor: '#111', marginRight: 8 };
const btnGhost = { ...btnBase };
const btnStyle = { ...btnBase, marginLeft: 8 };