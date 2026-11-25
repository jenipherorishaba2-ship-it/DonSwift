'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useFetch } from '@/components/ui';
import { MicButton, SpeakButton } from '@/components/Voice';

const NEEDS = ['Deaf / hard of hearing: Ugandan Sign Language interpreter at interview', 'Blind / low vision: screen reader or large print', 'Wheelchair user: step-free interview venue', 'Need extra time for tests', 'Contact by text/WhatsApp only'];
const COMM = ['Phone call', 'Text / WhatsApp', 'Email', 'Video call with sign language'];

export default function Apply() {
  const { data: vacs } = useFetch('/api/vacancies');
  const [mode, setMode] = useState('story');
  const [f, setF] = useState({ full_name: '', gender: '', age: '', school: '', education: '', years_experience: '', phone: '', profile_text: '', vacancy_id: '', comm_pref: 'Phone call' });
  const [needs, setNeeds] = useState([]);
  const [other, setOther] = useState('');
  const [done, setDone] = useState(null);
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    const r = await fetch('/api/candidates', { method: 'POST', body: JSON.stringify({ ...f, accommodations: [...needs, other].filter(Boolean).join('; ') || null, channel: mode === 'voice' ? 'voice' : mode === 'story' ? 'web-story' : 'web' }) });
    const j = await r.json();
    if (!r.ok) return setErr(j.error);
    setDone(j);
  };
  if (done) return (
    <div className="card max-w-xl">
      <h1>🎉 Thank you, {f.full_name.split(' ')[0]}!</h1>
      <p className="mt-2">Your reference number is <b className="text-indigo-600 text-xl">{done.ref}</b>. Keep it to check your status any time with the assistant.</p>
      <p className="text-sm text-slate-500 mt-2">We found skills in your story and matched you against every open job, not only the one you picked.</p>
      <div className="flex gap-2 mt-4"><Link className="btn-primary" href={`/candidates/${done.id}`}>See my skills profile</Link><Link className="btn-ghost" href="/challenge">Take the skills challenge</Link></div>
    </div>
  );
  return (
    <div className="max-w-3xl space-y-4">
      <h1>Apply to Donswift</h1>
      <p className="text-slate-500 text-sm">No CV? No problem. Tell us what you have done in your own words. Selling in a market, riding a boda, leading a church group, farming: it all counts.</p>
      <div className="flex gap-2">
        <button onClick={() => setMode('story')} className={mode === 'story' ? 'btn-primary' : 'btn-ghost'}>🗣 Tell my story (no CV)</button>
        <button onClick={() => setMode('voice')} className={mode === 'voice' ? 'btn-primary' : 'btn-ghost'}>🎤 Speak my story</button>
        <button onClick={() => setMode('cv')} className={mode === 'cv' ? 'btn-primary' : 'btn-ghost'}>📄 Paste my CV</button>
        <SpeakButton text="Apply to Donswift. No C V needed. Tell us what work you have done in your own words. You can type, or press Speak my story and talk." />
      </div>
      <div className="card space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Full name</label><input className="input" value={f.full_name} onChange={set('full_name')} /></div>
          <div><label className="label">Phone</label><input className="input" value={f.phone} onChange={set('phone')} placeholder="07XXXXXXXX" /></div>
          <div><label className="label">Gender</label><select className="input" value={f.gender} onChange={set('gender')}><option value="">Prefer not to say</option><option>Female</option><option>Male</option></select></div>
          <div><label className="label">Age</label><input className="input" type="number" value={f.age} onChange={set('age')} /></div>
          <div><label className="label">Last school</label><input className="input" value={f.school} onChange={set('school')} /></div>
          <div><label className="label">Highest education</label><input className="input" value={f.education} onChange={set('education')} placeholder="e.g. UCE, UACE, Diploma, Degree" /></div>
          <div><label className="label">Years of work (any kind)</label><input className="input" type="number" value={f.years_experience} onChange={set('years_experience')} /></div>
          <div><label className="label">Job you are applying for</label><select className="input" value={f.vacancy_id} onChange={set('vacancy_id')}><option value="">Any job that fits me</option>{(vacs || []).map((v) => <option key={v.id} value={v.id}>{v.title}</option>)}</select></div>
        </div>
        <div>
          <label className="label">{mode !== 'cv' ? 'What work have you done? What are you good at? (any language style is fine)' : 'Paste your CV text'}</label>
          {mode === 'voice' && <div className="mb-2 flex items-center gap-3"><MicButton label="Start speaking" onText={(t) => setF((x) => ({ ...x, profile_text: (x.profile_text + ' ' + t).trim() }))} /><span className="text-xs text-slate-500">Talk naturally. Your words appear below and you can correct them.</span></div>}
          <textarea className="input h-40" value={f.profile_text} onChange={set('profile_text')} placeholder={mode !== 'cv' ? 'e.g. I sold phones in my uncle\'s kiosk for 2 years, kept the stock book, and I am the chairperson of our youth group…' : ''} />
        </div>
        <fieldset className="rounded-xl border border-teal-200 bg-teal-50 p-4">
          <legend className="px-2 text-sm font-semibold text-teal-800">♿ Do you need any adjustments? (optional)</legend>
          <p className="text-xs text-teal-700 mb-2">This helps us prepare your interview and contact you the right way. It is never used to score or filter you, and recruiters see only "adjustments needed" while reviewing anonymously.</p>
          <div className="grid md:grid-cols-2 gap-1">{NEEDS.map((n) => <label key={n} className="text-sm flex gap-2 items-start"><input type="checkbox" checked={needs.includes(n)} onChange={() => setNeeds(needs.includes(n) ? needs.filter((x) => x !== n) : [...needs, n])} />{n}</label>)}</div>
          <input className="input mt-2" placeholder="Anything else? (e.g. I need an interpreter for Luganda)" value={other} onChange={(e) => setOther(e.target.value)} />
          <label className="label mt-3">How should we contact you?</label>
          <select className="input" value={f.comm_pref} onChange={set('comm_pref')}>{COMM.map((c) => <option key={c}>{c}</option>)}</select>
        </fieldset>
        <div className="flex gap-2 items-center"><button className="btn-primary" onClick={submit}>Submit application</button><span className="text-sm text-red-600">{err}</span></div>
      </div>
    </div>
  );
}
