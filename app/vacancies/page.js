'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFetch, Loading, RAG, RAGText, Pill } from '@/components/ui';
import Blueprint from '@/components/Blueprint';

const SAMPLE = `We need a Field Sales Officer for our Jinja branch.
Requirements:
- Must have proven sales experience and meet monthly targets.
- Excellent communication and customer care skills are essential.
- Must have a valid driving permit (motorcycle).
- Record keeping of daily sales and stock.
- Social media marketing is an added advantage.
- Diploma preferred. Must be honest and self-motivated.`;

export default function Vacancies() {
  const { data, error } = useFetch('/api/vacancies');
  const router = useRouter();
  const [form, setForm] = useState({ title: '', client: '', positions: 1, deadline: '', description: '' });
  const [bp, setBp] = useState(null);
  const [msg, setMsg] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const decode = async () => {
    const r = await fetch('/api/blueprint', { method: 'POST', body: JSON.stringify({ description: form.description }) });
    setBp(await r.json());
  };
  const save = async () => {
    const r = await fetch('/api/vacancies', { method: 'POST', body: JSON.stringify({ ...form, blueprint: bp }) });
    const j = await r.json();
    if (!r.ok) return setMsg(j.error);
    router.push(`/vacancies/${j.id}`);
  };

  return (
    <div className="space-y-6">
      <h1>Vacancies</h1>
      {!data ? <Loading error={error} /> : (
        <div className="grid md:grid-cols-3 gap-4">
          {data.map((v) => (
            <Link key={v.id} href={`/vacancies/${v.id}`} className="card hover:ring-2 ring-brand-400">
              <div className="flex justify-between items-start"><div className="font-bold">{v.title}</div><span className={`w-3 h-3 rounded-full ${RAG[v.rag.status]}`} /></div>
              <div className="text-xs text-slate-500">{v.client} · {v.location}</div>
              <div className="text-sm mt-3">{v.rag.days} days left · {RAGText[v.rag.status]} · {v.shortlisted}/{v.rag.need} shortlisted</div>
              <div className="flex flex-wrap gap-1 mt-3">{v.blueprint.skills.slice(0, 5).map((s) => <Pill key={s.id}>{s.label}</Pill>)}</div>
            </Link>
          ))}
        </div>
      )}

      <div className="card">
        <h2 className="font-bold text-lg">🧩 Vacancy Decoder</h2>
        <p className="text-sm text-slate-500 mb-4">Paste the client's job description. TalentLens turns it into a measurable competency blueprint and a practical challenge. A recruiter checks it before it goes live.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Job title</label><input className="input" value={form.title} onChange={set('title')} /></div>
              <div><label className="label">Client</label><input className="input" value={form.client} onChange={set('client')} /></div>
              <div><label className="label">Positions</label><input type="number" className="input" value={form.positions} onChange={set('positions')} /></div>
              <div><label className="label">Deadline</label><input type="date" className="input" value={form.deadline} onChange={set('deadline')} /></div>
            </div>
            <div>
              <div className="flex justify-between"><label className="label">Job description</label><button className="text-xs text-brand-600" onClick={() => setForm({ ...form, title: form.title || 'Field Sales Officer', client: form.client || 'Jinja Distributors', deadline: form.deadline || new Date(Date.now() + 12 * 864e5).toISOString().slice(0, 10), description: SAMPLE })}>use sample</button></div>
              <textarea className="input h-56" value={form.description} onChange={set('description')} placeholder="Paste the job description here…" />
            </div>
            <button className="btn-primary" onClick={decode} disabled={!form.description}>Decode into blueprint →</button>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            {bp ? (
              <>
                <Blueprint bp={bp} editable onChange={setBp} />
                <div className="mt-4 flex gap-2 items-center"><button className="btn-primary" onClick={save}>✓ Approve blueprint & publish</button><span className="text-sm text-red-600">{msg}</span></div>
              </>
            ) : <div className="text-sm text-slate-400">The blueprint will appear here.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
