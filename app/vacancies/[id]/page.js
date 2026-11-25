'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useFetch, Loading, useBlind, who, BandBadge, GemBadge, Score, SkillChip, RAG, RAGText, Pill, AdjustBadge } from '@/components/ui';
import Blueprint from '@/components/Blueprint';
import DecisionBox from '@/components/DecisionBox';

export default function VacancyPage({ params }) {
  const { data, error, reload } = useFetch(`/api/vacancies/${params.id}`, [params.id]);
  const [blind] = useBlind();
  const [filter, setFilter] = useState('all');
  if (!data) return <Loading error={error} />;
  const { vacancy: v, ranked } = data;
  const list = ranked.filter((r) => filter === 'all' || (filter === 'applied' ? r.appliedTo.includes(v.title) : !r.appliedTo.includes(v.title)));
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/vacancies" className="text-xs text-indigo-600">← Vacancies</Link>
          <h1>{v.title}</h1>
          <div className="text-sm text-slate-500">{v.client} · {v.location} · {v.positions} position(s)</div>
        </div>
        <div className="card !p-3 flex items-center gap-3"><span className={`w-4 h-4 rounded-full ${RAG[v.rag.status]}`} /><div><div className="font-bold">{v.rag.days} days to deadline</div><div className="text-xs text-slate-500">{RAGText[v.rag.status]} · {v.shortlisted}/{v.rag.need} shortlisted</div></div></div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card h-fit">
          <h2 className="font-bold mb-3">Competency blueprint</h2>
          <Blueprint bp={v.blueprint} />
          <details className="mt-4 text-xs text-slate-500"><summary className="cursor-pointer">Original job description</summary><pre className="whitespace-pre-wrap mt-2">{v.description}</pre></details>
        </div>
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Ranked across the WHOLE talent pool</h2>
            <div className="flex gap-1 text-xs">{[['all', 'Everyone'], ['applied', 'Applied here'], ['other', 'Discovered from other roles']].map(([k, l]) => <button key={k} onClick={() => setFilter(k)} className={`px-2 py-1 rounded ${filter === k ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>{l}</button>)}</div>
          </div>
          {list.map((r, i) => (
            <div key={r.candidateId} className={`card ${r.hiddenGem ? 'ring-2 ring-fuchsia-300' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="text-2xl font-extrabold text-slate-300 w-8">#{i + 1}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/candidates/${r.candidateId}`} className="font-bold hover:underline">{who(r.candidate, blind)}</Link>
                    <BandBadge band={r.band} />
                    {r.hiddenGem && <GemBadge />}
                    <AdjustBadge c={r.candidate} blind={blind} />
                    {r.potentialGem && <Pill color="bg-sky-100 text-sky-700">✨ Potential: invite to challenge</Pill>}
                    {!r.appliedTo.includes(v.title) && <Pill color="bg-indigo-50 text-indigo-700">Applied for: {r.appliedTo.join(', ') || '—'}</Pill>}
                    {r.application && <Pill color="bg-slate-800 text-white">{r.application.status}</Pill>}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{blind ? 'Identity hidden' : `${r.candidate.gender}, ${r.candidate.age} · ${r.candidate.school}`} · {r.candidate.education} · via {r.candidate.channel}</div>
                  <p className="text-sm mt-2">{r.explanation}</p>
                  <div className="flex flex-wrap gap-1 mt-2">{r.matched.map((s) => <SkillChip key={s.id} s={s} />)}{r.missing.map((s) => <span key={s.id} className="px-2 py-1 rounded-lg text-xs bg-red-50 text-red-600 line-through">{s.label}</span>)}</div>
                  {r.lastDecision && <div className="text-xs mt-2 text-slate-600 bg-slate-50 rounded p-2">Last decision: <b className="capitalize">{r.lastDecision.action}</b> {r.lastDecision.is_override ? '(override)' : ''} · "{r.lastDecision.reason}"</div>}
                  <DecisionBox candidateId={r.candidateId} vacancyId={v.id} aiBand={r.band} onDone={reload} />
                </div>
                <div className="w-40 space-y-2">
                  <div className="text-center"><div className="text-3xl font-extrabold text-indigo-600">{r.overall}%</div><div className="text-[10px] uppercase text-slate-400">TalentLens match</div></div>
                  <Score label="Skill fit" value={r.skillFit} />
                  <Score label="Challenge" value={r.challenge} color="bg-fuchsia-500" />
                  <Score label="Keyword CV filter" value={r.cv} color="bg-slate-400" />
                </div>
              </div>
            </div>
          ))}
          <div className="text-xs text-slate-500">✓ = skill stated directly · ↗ = skill proven through transferable experience (hover to see evidence) · struck out = gap. Match = 45% skill fit + 55% practical challenge. The keyword CV score is shown for comparison only.</div>
        </div>
      </div>
    </div>
  );
}
