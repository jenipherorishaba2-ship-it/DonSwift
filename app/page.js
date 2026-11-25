'use client';
import Link from 'next/link';
import { useFetch, Loading, useBlind, who, RAG, RAGText, BandBadge, GemBadge } from '@/components/ui';

function Stat({ label, value, sub, color = 'text-slate-900' }) {
  return <div className="card"><div className="label">{label}</div><div className={`text-3xl font-extrabold ${color}`}>{value}</div>{sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}</div>;
}

export default function Dashboard() {
  const { data, error } = useFetch('/api/dashboard');
  const [blind] = useBlind();
  if (!data) return <Loading error={error} />;
  const { stats } = data;
  return (
    <div className="space-y-6">
      <div>
        <h1>Recruiter Command Centre</h1>
        <p className="text-slate-500 text-sm">The AI sorts, explains and suggests. You decide.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Applications" value={stats.applications} sub={`${stats.candidates} people in talent pool`} />
        <Stat label="Hidden Gems found" value={stats.hiddenGems} sub="Weak CV, strong proven skill" color="text-fuchsia-600" />
        <Stat label="Cross-role matches" value={stats.crossMatches} sub="Strong fit for a job they didn't apply to" color="text-brand-600" />
        <Stat label="Questions auto-answered" value={stats.chats} sub="Calls the team didn't have to take" color="text-emerald-600" />
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-3"><h2 className="font-bold text-lg">Vacancies by deadline</h2><Link href="/vacancies" className="text-sm text-brand-600">+ Decode a new vacancy</Link></div>
        <div className="divide-y">
          {data.vacancies.map((v) => (
            <Link key={v.id} href={`/vacancies/${v.id}`} className="flex items-center gap-4 py-3 hover:bg-slate-50 rounded-lg px-2">
              <span className={`w-3 h-3 rounded-full ${RAG[v.rag.status]}`} />
              <div className="flex-1">
                <div className="font-semibold">{v.title}</div>
                <div className="text-xs text-slate-500">{v.client} · {v.positions} position(s) · {v.applicants} applicants</div>
              </div>
              <div className="text-sm text-center w-28"><div className="font-bold">{v.rag.days} days</div><div className="text-xs text-slate-500">{RAGText[v.rag.status]}</div></div>
              <div className="text-sm text-center w-28"><div className="font-bold">{v.shortlisted}/{v.rag.need}</div><div className="text-xs text-slate-500">shortlisted</div></div>
              <div className="w-64 text-xs space-y-1">
                {v.topMatches.map((m) => <div key={m.candidateId} className="flex justify-between gap-2"><span className="truncate">{who(m, blind)} {m.hiddenGem && '💎'}</span><span className="font-semibold">{m.overall}%</span></div>)}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="font-bold mb-1">⚖️ Fairness & inclusion monitor</h2>
        <p className="text-xs text-slate-500 mb-3">Checks that the system is widening the net, not narrowing it. Disability and gender are never used in scoring; they are only measured here.</p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          {[
            [data.fairness.womenPool + '%', 'Women in pool'],
            [data.fairness.womenShortlist === null ? '—' : data.fairness.womenShortlist + '%', `Women on shortlists (${data.fairness.shortlistedCount})`],
            [data.fairness.noDegreeTop + '%', 'Top-3 matches without a degree'],
            [data.fairness.altChannel + '%', 'Applied by WhatsApp / USSD / voice / sign video'],
            [`${data.fairness.adjustmentsInTop}/${data.fairness.withAdjustments}`, 'Candidates with disabilities in a top-3'],
            [data.fairness.gemsInTop, 'Hidden Gems in top-3 slots'],
          ].map(([v, l]) => <div key={l} className="rounded-xl bg-teal-50 p-3"><div className="text-2xl font-extrabold text-teal-700">{v}</div><div className="text-[11px] text-teal-900">{l}</div></div>)}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-bold mb-3">💎 Hidden Gems (a keyword filter would have rejected them)</h2>
          {data.gems.length === 0 && <div className="text-sm text-slate-400">None yet.</div>}
          {data.gems.map((g) => (
            <Link key={g.candidateId + '-' + g.vacancyId} href={`/vacancies/${g.vacancyId}`} className="block rounded-xl border border-fuchsia-200 bg-fuchsia-50 p-3 mb-2">
              <div className="flex justify-between"><b>{who(g, blind)}</b><GemBadge /></div>
              <div className="text-xs mt-1">For <b>{g.vacancy}</b>: CV filter {g.cv}% → challenge {g.challenge}% → TalentLens match <b>{g.overall}%</b></div>
            </Link>
          ))}
          <h2 className="font-bold mb-3 mt-5">🔀 Strong matches for roles they never applied to</h2>
          {data.cross.map((g) => (
            <Link key={g.candidateId + '-' + g.vacancyId} href={`/vacancies/${g.vacancyId}`} className="flex justify-between text-sm py-1.5 border-b last:border-0">
              <span>{who(g, blind)} → <b>{g.vacancy}</b></span><span className="flex gap-2 items-center"><BandBadge band={g.band} />{g.overall}%</span>
            </Link>
          ))}
        </div>
        <div className="card">
          <h2 className="font-bold mb-3">🧑‍⚖️ Human decisions log</h2>
          <div className="text-xs text-slate-500 mb-3">{stats.decisions} decisions · {stats.overrides} overrides of the AI suggestion. Every decision has a written reason.</div>
          {data.recent.length === 0 && <div className="text-sm text-slate-400">No decisions yet. Open a vacancy to shortlist.</div>}
          {data.recent.map((d) => (
            <div key={d.id} className="text-sm border-b last:border-0 py-2">
              <div className="flex justify-between"><span><b className="capitalize">{d.action}</b> · {blind ? 'Candidate ' + d.ref : d.name} · {d.vacancy}</span>{d.is_override ? <span className="text-xs font-bold text-orange-600">OVERRIDE</span> : null}</div>
              <div className="text-xs text-slate-500 italic">"{d.reason}" (AI score {d.ai_score}%)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
