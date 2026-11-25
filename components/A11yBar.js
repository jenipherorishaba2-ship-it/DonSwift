'use client';
import { useEffect, useState } from 'react';
import { speak } from './Voice';

const MODES = [['a11y-large', 'A+', 'Larger text'], ['a11y-contrast', '◐', 'High contrast'], ['a11y-readable', 'Aa', 'Readable (dyslexia-friendly) font']];

export default function A11yBar() {
  const [on, setOn] = useState({});
  useEffect(() => { const s = JSON.parse(localStorage.getItem('a11y') || '{}'); setOn(s); }, []);
  useEffect(() => {
    for (const [cls] of MODES) document.documentElement.classList.toggle(cls, !!on[cls]);
    localStorage.setItem('a11y', JSON.stringify(on));
  }, [on]);
  const readPage = () => { const sel = window.getSelection()?.toString(); speak(sel || document.querySelector('main')?.innerText.slice(0, 1500) || ''); };
  return (
    <div className="mt-4 rounded-xl bg-slate-800 p-3">
      <div className="text-[11px] font-semibold text-slate-300 mb-2">♿ Accessibility</div>
      <div className="flex gap-1 flex-wrap">
        {MODES.map(([cls, icon, label]) => (
          <button key={cls} title={label} aria-label={label} aria-pressed={!!on[cls]} onClick={() => setOn({ ...on, [cls]: !on[cls] })} className={`px-2 py-1 rounded text-sm font-bold ${on[cls] ? 'bg-amber-400 text-black' : 'bg-slate-700'}`}>{icon}</button>
        ))}
        <button title="Read page or selected text aloud" aria-label="Read aloud" onClick={readPage} className="px-2 py-1 rounded text-sm bg-slate-700">🔊</button>
        <button title="Stop reading" aria-label="Stop reading" onClick={() => window.speechSynthesis?.cancel()} className="px-2 py-1 rounded text-sm bg-slate-700">⏹</button>
      </div>
    </div>
  );
}
