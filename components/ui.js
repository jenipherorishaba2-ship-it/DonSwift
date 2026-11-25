'use client';
import { useEffect, useState } from 'react';

export function useBlind() {
  const [blind, setBlind] = useState(false);
  useEffect(() => {
    const read = () => setBlind(localStorage.getItem('blind') === '1');
    read();
    window.addEventListener('blind-change', read);
    return () => window.removeEventListener('blind-change', read);
  }, []);
  const toggle = () => { localStorage.setItem('blind', blind ? '0' : '1'); window.dispatchEvent(new Event('blind-change')); };
  return [blind, toggle];
}

export const who = (c, blind) => (blind ? `Candidate ${c.ref}` : c.full_name);

export function useFetch(url, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const load = () => fetch(url).then(async (r) => { const j = await r.json(); if (!r.ok) throw new Error(j.error); setData(j); setError(null); }).catch((e) => setError(e.message));
  useEffect(() => { load(); }, deps); // eslint-disable-line
  return { data, error, reload: load };
}

export function Loading({ error }) {
  if (error) return <div className="card border-red-300 bg-red-50 text-red-700"><b>Could not load data.</b><div className="text-sm mt-1">{error}</div><div className="text-sm mt-2">Check: XAMPP MySQL is started, the <code>talentlens</code> database was imported, and <code>.env.local</code> is correct.</div></div>;
  return <div className="text-slate-400 animate-pulse">Loading…</div>;
}

const BAND = { Strong: 'bg-emerald-100 text-emerald-800', Possible: 'bg-amber-100 text-amber-800', Weak: 'bg-slate-100 text-slate-600' };
export const BandBadge = ({ band }) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${BAND[band]}`}>{band}</span>;
export const GemBadge = () => <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-fuchsia-100 text-fuchsia-700 ring-1 ring-fuchsia-300">💎 Hidden Gem</span>;
export const Pill = ({ children, color = 'bg-slate-100 text-slate-700' }) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{children}</span>;

export function Score({ value, label, color = 'bg-indigo-500' }) {
  return (
    <div className="min-w-[90px]">
      <div className="flex justify-between text-[11px] text-slate-500"><span>{label}</span><span className="font-semibold text-slate-700">{value === null || value === undefined ? '—' : value + '%'}</span></div>
      <div className="h-1.5 bg-slate-200 rounded-full mt-0.5"><div className={`h-1.5 rounded-full ${color}`} style={{ width: `${value || 0}%` }} /></div>
    </div>
  );
}

export const RAG = { red: 'bg-red-500', amber: 'bg-amber-400', green: 'bg-emerald-500' };
export const RAGText = { red: 'Urgent', amber: 'At risk', green: 'On track' };

export function SkillChip({ s }) {
  const style = s.type === 'transferable' ? 'bg-sky-50 text-sky-800 ring-1 ring-sky-200' : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200';
  return <span title={s.evidence} className={`px-2 py-1 rounded-lg text-xs ${style}`}>{s.type === 'transferable' ? '↗ ' : '✓ '}{s.label}</span>;
}

// Adjustments are for planning the process (interpreter, access, contact method), NEVER used in scoring.
export function AdjustBadge({ c, blind }) {
  if (!c?.accommodations) return null;
  return <span title={blind ? 'Details visible after blind mode is off' : c.accommodations} className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 ring-1 ring-teal-300">♿ {blind ? 'Adjustments needed' : c.accommodations}{!blind && c.comm_pref ? ' · prefers ' + c.comm_pref : ''}</span>;
}
