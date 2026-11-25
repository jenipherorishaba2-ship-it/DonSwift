'use client';
import Link from 'next/link';
import { useFetch, Loading, useBlind, who, BandBadge, GemBadge, Pill, SkillChip, AdjustBadge } from '@/components/ui';

export default function Candidates() {
  const { data, error } = useFetch('/api/candidates');
  const [blind] = useBlind();
  if (!data) return <Loading error={error} />;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h1>Talent Pool</h1><Link href="/apply" className="btn-primary">+ Add candidate</Link></div>
      <div className="grid md:grid-cols-2 gap-4">
        {data.map((c) => (
          <Link key={c.id} href={`/candidates/${c.id}`} className={`card hover:ring-2 ring-indigo-400 ${c.gem ? 'ring-2 ring-fuchsia-300' : ''}`}>
            <div className="flex justify-between items-start">
              <div><div className="font-bold">{who(c, blind)}</div><div className="text-xs text-slate-500">{c.ref} · {blind ? 'identity hidden' : c.school} · {c.education} · via {c.channel}</div></div>
              <div className="flex flex-col items-end gap-1">{c.gem && <GemBadge />}<AdjustBadge c={c} blind={blind} /></div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">{c.skills.slice(0, 8).map((s) => <SkillChip key={s.id} s={s} />)}</div>
            <div className="text-sm mt-3 flex flex-wrap gap-2 items-center">
              Applied: {c.applied.map((a) => <Pill key={a.id}>{a.vacancy} · {a.status}</Pill>)}
            </div>
            {c.best && <div className="text-sm mt-2">Best fit: <b>{c.best.vacancy}</b> {c.best.overall}% <BandBadge band={c.best.band} /></div>}
          </Link>
        ))}
      </div>
    </div>
  );
}
