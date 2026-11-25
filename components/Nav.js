'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBlind } from './ui';
import A11yBar from './A11yBar';

const LINKS = [
  ['/', 'Dashboard', '📊'],
  ['/vacancies', 'Vacancies', '🧩'],
  ['/candidates', 'Talent Pool', '👥'],
  ['/matrix', 'Match Matrix', '🔀'],
  ['/challenge', 'Skills Challenge', '🎯'],
  ['/apply', 'Apply (no CV needed)', '📝'],
  ['/assistant', 'Candidate Assistant', '💬'],
];

export default function Nav() {
  const path = usePathname();
  const [blind, toggle] = useBlind();
  return (
    <aside className="w-60 shrink-0 bg-slate-900 text-slate-200 min-h-screen p-4 flex flex-col">
      <div className="mb-6">
        <div className="text-xl font-extrabold text-white">Talent<span className="text-indigo-400">Lens</span></div>
        <div className="text-[11px] text-slate-400">Skills over CVs. Humans over algorithms.</div>
      </div>
      <nav className="space-y-1 flex-1">
        {LINKS.map(([href, label, icon]) => {
          const active = href === '/' ? path === '/' : path.startsWith(href);
          return <Link key={href} href={href} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${active ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><span>{icon}</span>{label}</Link>;
        })}
      </nav>
      <button onClick={toggle} className={`mt-4 rounded-xl p-3 text-left text-sm ${blind ? 'bg-emerald-600 text-white' : 'bg-slate-800'}`}>
        <div className="font-semibold">{blind ? '🙈 Blind mode ON' : '👁 Blind mode OFF'}</div>
        <div className="text-[11px] opacity-80">Hides name, gender, age & school to reduce bias</div>
      </button>
      <A11yBar />
      <div className="text-[10px] text-slate-500 mt-3">Donswift Company Ltd · Code Titans</div>
    </aside>
  );
}
