'use client';
import { useState } from 'react';

const ACTIONS = [['shortlist', '✓ Shortlist', 'bg-emerald-600'], ['interview', '📅 Interview', 'bg-brand-600'], ['hold', '⏸ Hold', 'bg-slate-500'], ['reject', '✕ Not selected', 'bg-red-600']];

export default function DecisionBox({ candidateId, vacancyId, aiBand, onDone }) {
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState('');
  const submit = async () => {
    const r = await fetch('/api/decisions', { method: 'POST', body: JSON.stringify({ candidate_id: candidateId, vacancy_id: vacancyId, action, reason }) });
    const j = await r.json();
    if (!r.ok) return setMsg(j.error);
    setMsg(j.isOverride ? 'Saved as an OVERRIDE of the AI suggestion.' : 'Saved.');
    setAction(null); setReason('');
    onDone && onDone();
  };
  const goesAgainstAI = action && ((['shortlist', 'interview'].includes(action) && aiBand === 'Weak') || (action === 'reject' && aiBand === 'Strong'));
  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-1">
        {ACTIONS.map(([a, l, c]) => <button key={a} onClick={() => setAction(a)} className={`btn text-white text-xs !py-1 ${c} ${action === a ? 'ring-2 ring-offset-1 ring-slate-800' : 'opacity-90'}`}>{l}</button>)}
      </div>
      {action && (
        <div className="mt-2 space-y-2">
          {goesAgainstAI && <div className="text-xs text-orange-700 bg-orange-50 rounded p-2">You are overriding the AI suggestion ({aiBand}). That is fine; please explain why so the system can learn.</div>}
          <input className="input" autoFocus placeholder="Reason (required), e.g. 'Strong challenge result, interview to confirm leadership'" value={reason} onChange={(e) => setReason(e.target.value)} />
          <div className="flex gap-2"><button className="btn-primary !py-1" onClick={submit}>Confirm decision</button><button className="btn-ghost !py-1" onClick={() => setAction(null)}>Cancel</button></div>
        </div>
      )}
      {msg && <div className="text-xs mt-1 text-slate-600">{msg}</div>}
    </div>
  );
}
