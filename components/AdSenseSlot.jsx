"use client";

import { useEffect, useRef } from 'react';

/**
 * Minimal AdSense slot.
 * Requires NEXT_PUBLIC_ADSENSE_CLIENT (e.g. ca-pub-XXXX) and a slot id passed via props.
 * If env or slot is missing, renders nothing (keeps layout clean without extra conditionals).
 */
export default function AdSenseSlot({ slot, format = 'auto', className = '', style }) {
  const ref = useRef(null);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client || !slot) return null;

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Fail silently; ad script may be blocked.
    }
  }, []);

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
