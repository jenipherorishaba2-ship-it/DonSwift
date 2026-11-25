import { NextResponse } from 'next/server';
import { loadState } from '@/lib/state';
import { feedbackFor } from '@/lib/engine';
export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  try {
    const s = await loadState();
    const id = Number(params.id);
    const c = s.candidates.find((x) => x.id === id);
    if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const vt = (vid) => s.vacancies.find((v) => v.id === vid)?.title;
    const matches = s.matches.filter((m) => m.candidateId === id).sort((a, b) => b.overall - a.overall).map((m) => ({ ...m, vacancy: vt(m.vacancyId), feedback: feedbackFor(m, vt(m.vacancyId)), application: s.apps.find((a) => a.candidate_id === id && a.vacancy_id === m.vacancyId) || null }));
    return NextResponse.json({ candidate: c, matches, decisions: s.decisions.filter((d) => d.candidate_id === id).map((d) => ({ ...d, vacancy: vt(d.vacancy_id) })) });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
