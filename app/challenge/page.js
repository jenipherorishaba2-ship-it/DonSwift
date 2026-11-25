'use client';
import { useEffect, useState } from 'react';
import { useFetch } from '@/components/ui';
import { SpeakButton } from '@/components/Voice';

export default function Challenge() {
  const { data: cands } = useFetch('/api/candidates');
  const { data: vacs } = useFetch('/api/vacancies');
  const [cid, setCid] = useState('');
  const [vid, setVid] = useState('');
  const [ch, setCh] = useState(null);
  const [ans, setAns] = useState({});
  const [result, setResult] = useState(null);
  useEffect(() => { setCh(null); setAns({}); setResult(null); if (vid) fetch(`/api/challenge?vacancy_id=${vid}`).then((r) => r.json()).then(setCh); }, [vid]);
  const submit = async () => {
    const r = await fetch('/api/challenge', { method: 'POST', body: JSON.stringify({ candidate_id: cid, vacancy_id: vid, answers: Object.fromEntries(ch.questions.map((q) => [q.id, ans[q.id] ?? -1])) }) });
    setResult(await r.json());
  };
  return (
    <div className="max-w-3xl space-y-4">
      <h1>🎯 Proof-of-Skill Challenge</h1>
      <p className="text-sm text-slate-500">Show what you can DO. Short, real-life scenarios built from the job's blueprint. Your score counts more than your CV.</p>
      <div className="text-xs bg-teal-50 text-teal-800 rounded-lg p-2">♿ Untimed, text-only, works with screen readers. Tap 🔊 to hear any question. Deaf candidates do the in-person part with a sign language interpreter; candidates with low vision can use large text / high contrast (bottom left).</div>
      <div className="card grid grid-cols-2 gap-3">
        <div><label className="label">I am</label><select className="input" value={cid} onChange={(e) => setCid(e.target.value)}><option value="">Select…</option>{(cands || []).map((c) => <option key={c.id} value={c.id}>{c.ref} · {c.full_name}</option>)}</select></div>
        <div><label className="label">Job</label><select className="input" value={vid} onChange={(e) => setVid(e.target.value)}><option value="">Select…</option>{(vacs || []).map((v) => <option key={v.id} value={v.id}>{v.title}</option>)}</select></div>
      </div>
      {ch && !result && (
        <div className="space-y-3">
          <div className="card bg-indigo-50 border-indigo-200 text-sm"><b>Part B (done in person, scored by a recruiter):</b><ul className="list-disc pl-5">{ch.tasks.map((t) => <li key={t.task}>{t.task}</li>)}</ul></div>
          {ch.questions.map((q, i) => (
            <div key={q.id} className="card">
              <div className="text-xs text-indigo-600 font-semibold">{q.skill}</div>
              <div className="font-medium mb-2 flex gap-2 items-start"><span className="flex-1">{i + 1}. {q.q}</span><SpeakButton text={q.q + '. Options: ' + q.o.map((o, k) => (k + 1) + ', ' + o).join('. ')} /></div>
              <div className="space-y-1">{q.o.map((o, j) => <label key={j} className={`flex gap-2 text-sm p-2 rounded-lg cursor-pointer ${ans[q.id] === j ? 'bg-indigo-100' : 'hover:bg-slate-50'}`}><input type="radio" name={q.id} checked={ans[q.id] === j} onChange={() => setAns({ ...ans, [q.id]: j })} />{o}</label>)}</div>
            </div>
          ))}
          <button className="btn-primary" disabled={!cid} onClick={submit}>{cid ? 'Submit challenge' : 'Select who you are first'}</button>
        </div>
      )}
      {result && (
        <div className="card text-center">
          <div className="text-5xl font-extrabold text-fuchsia-600">{result.score}%</div>
          <div className="text-slate-500">{result.correct} of {result.total} correct. Your score has been sent to the recruiter and your match has been updated.</div>
          <a href={`/candidates/${cid}`} className="btn-primary mt-4">See updated matches</a>
        </div>
      )}
    </div>
  );
}
