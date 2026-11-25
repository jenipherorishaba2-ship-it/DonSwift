import { NextResponse } from 'next/server';
import { loadState } from '@/lib/state';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const s = await loadState();
    return NextResponse.json({
      vacancies: s.vacancies.map((v) => ({ id: v.id, title: v.title })),
      rows: s.candidates.map((c) => ({ id: c.id, ref: c.ref, full_name: c.full_name, gender: c.gender, age: c.age, school: c.school, cells: s.vacancies.map((v) => { const m = s.matches.find((x) => x.candidateId === c.id && x.vacancyId === v.id); return { overall: m.overall, band: m.band, hiddenGem: m.hiddenGem, applied: s.apps.some((a) => a.candidate_id === c.id && a.vacancy_id === v.id && a.source === 'applied') }; }) })),
    });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
