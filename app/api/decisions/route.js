import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { loadState } from '@/lib/state';

const STATUS = { shortlist: 'Shortlisted', interview: 'Interview', hire: 'Hired', reject: 'Not selected', hold: 'On hold' };

export async function POST(req) {
  const b = await req.json();
  const cid = Number(b.candidate_id), vid = Number(b.vacancy_id);
  if (!STATUS[b.action]) return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  if (!b.reason || b.reason.trim().length < 5) return NextResponse.json({ error: 'Please write a reason (human judgement is always logged).' }, { status: 400 });
  const s = await loadState();
  const m = s.matches.find((x) => x.candidateId === cid && x.vacancyId === vid);
  const positive = ['shortlist', 'interview', 'hire'].includes(b.action);
  const isOverride = (positive && m?.band === 'Weak') || (b.action === 'reject' && m?.band === 'Strong') ? 1 : 0;
  await q('INSERT INTO decisions (candidate_id, vacancy_id, action, reason, recruiter, ai_score, is_override) VALUES (?,?,?,?,?,?,?)',
    [cid, vid, b.action, b.reason.trim(), b.recruiter || 'Recruiter', m?.overall ?? null, isOverride]);
  await q(`INSERT INTO applications (candidate_id, vacancy_id, source, status) VALUES (?,?,'ai_match',?)
           ON DUPLICATE KEY UPDATE status = VALUES(status)`, [cid, vid, STATUS[b.action]]);
  return NextResponse.json({ ok: true, isOverride, status: STATUS[b.action] });
}
