"use client";
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Lazy load the heavy / popup-producing script only after consent / interaction
const MonetagScripts = dynamic(() => import('./MonetagScripts'), { ssr: false });

/**
 * Opt‑in gate for Monetag / popup style ads.
 * Features:
 *  - Respects env var NEXT_PUBLIC_MONETAG_AUTO=1 to auto load without gate.
 *  - Defers loading until a user gesture (button click) otherwise.
 *  - Provides a lightweight status + disable (page only) toggle.
 */
export default function MonetagOptIn({ position = 'sidebar' }) {
  // Global kill switch: if NEXT_PUBLIC_DISABLE_ADS=1, render nothing
  if (process.env.NEXT_PUBLIC_DISABLE_ADS === '1') return null;
  const auto = process.env.NEXT_PUBLIC_MONETAG_AUTO === '1';
  const [enabled, setEnabled] = useState(auto);
  const [dismissed, setDismissed] = useState(false);

  const enable = useCallback(() => {
    setEnabled(true);
  }, []);

  const disable = useCallback(() => {
    setEnabled(false);
    setDismissed(true);
  }, []);

  if (enabled) {
    return (
      <>
        <MonetagScripts />
        <div className="monetag-status" style={{marginTop:12}}>
          <span style={{fontSize:11, color:'var(--muted)'}}>Ads enabled</span>
          <button onClick={disable} style={btnStyle}>Disable (page)</button>
        </div>
      </>
    );
  }

  if (dismissed) return null; // user turned off this page

  return (
    <div className={`monetag-optin monetag-optin-${position}`} style={{marginTop:12}}>
      <div style={{fontSize:12, lineHeight:1.4, marginBottom:6}}>
        Support this site by enabling an ad script (may open popups). You can turn it off anytime.
      </div>
      <button onClick={enable} style={btnPrimary}>Enable Ads</button>
      <button onClick={() => setDismissed(true)} style={btnGhost}>No thanks</button>
    </div>
  );
}

const baseBtn = {
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 12,
  padding: '6px 10px',
  borderRadius: 4,
  border: '1px solid var(--border)',
  background: 'transparent'
};

const btnPrimary = {
  ...baseBtn,
  background: '#111',
  color: '#fff',
  borderColor: '#111',
  marginRight: 8
};

const btnGhost = {
  ...baseBtn,
  background: 'transparent'
};

const btnStyle = {
  ...baseBtn,
  marginLeft: 8
};
