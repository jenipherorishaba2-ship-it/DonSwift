'use client';
import { useRef, useState } from 'react';

// Read aloud: browser speech synthesis (works offline on most Windows/Chrome/Edge setups).
export function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(String(text).replace(/[•💎✓↗]/g, ''));
  u.lang = 'en-GB'; u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

export function SpeakButton({ text, className = '' }) {
  return <button type="button" aria-label="Read aloud" title="Read aloud" onClick={() => speak(text)} className={`text-xs px-2 py-1 rounded-full bg-slate-100 hover:bg-indigo-100 ${className}`}>🔊</button>;
}

// Voice input: browser speech recognition (Chrome / Edge). Lets candidates who
// cannot type well, or cannot read/write confidently, apply by speaking.
export function MicButton({ onText, label = 'Speak' }) {
  const [on, setOn] = useState(false);
  const rec = useRef(null);
  const start = () => {
    const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) { alert('Voice input works in Google Chrome or Microsoft Edge.'); return; }
    if (on) { rec.current?.stop(); return; }
    const r = new SR(); r.lang = 'en-UG'; r.interimResults = false; r.continuous = true;
    r.onresult = (e) => { const t = Array.from(e.results).slice(e.resultIndex).map((x) => x[0].transcript).join(' '); onText(t); };
    r.onend = () => setOn(false); r.onerror = () => setOn(false);
    rec.current = r; r.start(); setOn(true);
  };
  return <button type="button" onClick={start} aria-pressed={on} className={`btn ${on ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>{on ? '⏺ Listening… tap to stop' : `🎤 ${label}`}</button>;
}
