'use client';
import { useEffect, useState } from 'react';

// Put the client's logo at public/donswift-logo.png and it appears automatically.
// Until then a clean text wordmark is shown.
export default function Logo({ size = 'md', dark = false }) {
  const [missing, setMissing] = useState(true);
  useEffect(() => { fetch('/donswift-logo.png', { method: 'HEAD' }).then((r) => setMissing(!r.ok || !(r.headers.get('content-type') || '').startsWith('image'))).catch(() => setMissing(true)); }, []);
  const h = size === 'sm' ? 'h-9' : size === 'lg' ? 'h-20' : 'h-12';
  if (!missing) return <img src="/donswift-logo.png" alt="Donswift Company Ltd" className={`${h} w-auto object-contain`} onError={() => setMissing(true)} />;
  return (
    <div className="leading-none">
      <div className={`${size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'} font-extrabold tracking-tight ${dark ? 'text-white' : 'text-brand-800'}`}>DON<span className="text-accent-500">SWIFT</span></div>
      <div className={`text-[9px] uppercase tracking-[0.2em] ${dark ? 'text-brand-200' : 'text-slate-500'}`}>Company Ltd</div>
    </div>
  );
}
