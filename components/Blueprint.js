'use client';
import { Pill } from './ui';

const LEVEL = { must: 'bg-red-100 text-red-700', core: 'bg-brand-100 text-brand-700', nice: 'bg-slate-100 text-slate-600', credential: 'bg-amber-100 text-amber-700' };
export default function Blueprint({ bp, editable, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="label">Competencies (weight 1 to 3)</div>
        <div className="space-y-1">
          {bp.skills.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 text-sm">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${LEVEL[s.level]}`}>{s.level}</span>
              <span className="flex-1">{s.label}</span>
              {editable ? (
                <>
                  <select className="input !w-16 !py-1" value={s.weight} onChange={(e) => onChange({ ...bp, skills: bp.skills.map((x, j) => (j === i ? { ...x, weight: Number(e.target.value) } : x)) })}>{[1, 2, 3].map((w) => <option key={w}>{w}</option>)}</select>
                  <button className="text-red-500 text-xs" onClick={() => onChange({ ...bp, skills: bp.skills.filter((_, j) => j !== i) })}>remove</button>
                </>
              ) : <span className="text-brand-400">{'●'.repeat(s.weight)}</span>}
            </div>
          ))}
        </div>
      </div>
      {bp.behaviours.length > 0 && <div><div className="label">Behaviours (checked by humans)</div><div className="flex flex-wrap gap-1">{bp.behaviours.map((b) => <Pill key={b}>{b}</Pill>)}</div></div>}
      {bp.credentials.length > 0 && <div><div className="label">Credentials (signal only, never a hard filter)</div><div className="flex flex-wrap gap-1">{bp.credentials.map((b) => <Pill key={b} color="bg-amber-50 text-amber-700">{b}</Pill>)}</div></div>}
      <div><div className="label">Practical proof-of-skill tasks</div><ul className="text-sm list-disc pl-5 space-y-0.5">{bp.tasks.map((t) => <li key={t.task}><b>{t.skill}:</b> {t.task}</li>)}</ul></div>
      <div><div className="label">Never automated</div><ul className="text-sm list-disc pl-5">{bp.humanOnly.map((h) => <li key={h}>{h}</li>)}</ul></div>
    </div>
  );
}
