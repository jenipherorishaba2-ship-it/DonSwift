import { NextResponse } from 'next/server';
import { loadState } from '@/lib/state';
import { questionsFor } from '@/lib/questions';
export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  try {
    const s = await loadState();
    const id = Number(params.id);
    const v = s.vacancies.find((x) => x.id === id);
    if (!v) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const ranked = s.matches.filter((m) => m.vacancyId === id).sort((a, b) => b.overall - a.overall).map((m) => {
      const c = s.candidates.find((x) => x.id === m.candidateId);
      const app = s.apps.find((a) => a.candidate_id === c.id && a.vacancy_id === id);
      const last = s.decisions.find((d) => d.candidate_id === c.id && d.vacancy_id === id);
      // where did this candidate originally apply?
      const appliedTo = s.apps.filter((a) => a.candidate_id === c.id && a.source === 'applied').map((a) => s.vacancies.find((x) => x.id === a.vacancy_id)?.title);
      return { ...m, candidate: { id: c.id, ref: c.ref, full_name: c.full_name, gender: c.gender, age: c.age, school: c.school, education: c.education, channel: c.channel, accommodations: c.accommodations, comm_pref: c.comm_pref }, application: app || null, lastDecision: last || null, appliedTo };
    });
    return NextResponse.json({ vacancy: v, ranked, challengeQuestions: questionsFor(v.blueprint).length });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
