'use client';
import Link from 'next/link';
import { useFetch, Loading, useBlind, who, BandBadge, GemBadge, Score, SkillChip, Pill, AdjustBadge } from '@/components/ui';
import DecisionBox from '@/components/DecisionBox';

export default function CandidatePage({ params }) {
  const { data, error, reload } = useFetch(`/api/candidates/${params.id}`, [params.id]);
  const [blind] = useBlind();
  if (!data) return <Loading error={error} />;
  const { candidate: c, matches, decisions } = data;
  const direct = c.skills.filter((s) => s.type === 'direct');
  const trans = c.skills.filter((s) => s.type === 'transferable');
  return (
    <div className="space-y-6">
      <div>
        <Link href="/candidates" className="text-xs text-brand-600">← Talent pool</Link>
        <h1>{who(c, blind)}</h1>
        <div className="text-sm text-slate-500">{c.ref} · {blind ? 'Gender, age, school and phone hidden' : `${c.gender}, ${c.age} · ${c.school} · ${c.phone}`} · {c.education} · {c.years_experience} yrs · applied via {c.channel}</div>
        {c.accommodations && <div className="mt-2 flex items-center gap-2"><AdjustBadge c={c} blind={blind} /><span className="text-xs text-slate-500">Used only to plan interviews and contact. Never affects the match score.</span></div>}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="card"><div className="label">Their story / CV</div><p className="text-sm whitespace-pre-wrap">{c.profile_text}</p></div>
          <div className="card">
            <div className="label">Skills stated directly</div>
            <div className="flex flex-wrap gap-1 mb-4">{direct.map((s) => <SkillChip key={s.id} s={s} />)}</div>
            <div className="label">Transferable skills discovered</div>
            <div className="space-y-1">{trans.map((s) => <div key={s.id} className="text-sm"><SkillChip s={s} /> <span className="text-xs text-slate-500">from {s.evidence}</span></div>)}{!trans.length && <div className="text-sm text-slate-400">None</div>}</div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-bold">Matched against every open vacancy</h2>
          {matches.map((m) => (
            <div key={m.vacancyId} className={`card ${m.hiddenGem ? 'ring-2 ring-fuchsia-300' : ''}`}>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 items-center"><Link href={`/vacancies/${m.vacancyId}`} className="font-bold hover:underline">{m.vacancy}</Link><BandBadge band={m.band} />{m.hiddenGem && <GemBadge />}{m.application ? <Pill color="bg-slate-800 text-white">{m.application.source === 'applied' ? 'Applied' : 'Matched by recruiter'} · {m.application.status}</Pill> : <Pill color="bg-brand-50 text-brand-700">Did not apply</Pill>}</div>
                  <p className="text-sm mt-2">{m.explanation}</p>
                  <div className="text-xs mt-2 bg-emerald-50 text-emerald-800 rounded p-2"><b>Feedback the candidate receives:</b> {m.feedback}</div>
                  <DecisionBox candidateId={c.id} vacancyId={m.vacancyId} aiBand={m.band} onDone={reload} />
                </div>
                <div className="w-40 space-y-2">
                  <div className="text-center"><div className="text-3xl font-extrabold text-brand-600">{m.overall}%</div></div>
                  <Score label="Skill fit" value={m.skillFit} />
                  <Score label="Challenge" value={m.challenge} color="bg-fuchsia-500" />
                  <Score label="Keyword CV" value={m.cv} color="bg-slate-400" />
                </div>
              </div>
            </div>
          ))}
          {decisions.length > 0 && <div className="card"><div className="label">Decision history</div>{decisions.map((d) => <div key={d.id} className="text-sm py-1 border-b last:border-0"><b className="capitalize">{d.action}</b> · {d.vacancy} {d.is_override ? <span className="text-orange-600 text-xs font-bold">OVERRIDE</span> : ''}<div className="text-xs text-slate-500">"{d.reason}" · {d.recruiter} · {d.created_at}</div></div>)}</div>}
        </div>
      </div>
    </div>
  );
}
