import { NextResponse } from 'next/server';
import { loadState } from '@/lib/state';
import { q } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const s = await loadState();
    return NextResponse.json(s.candidates.map((c) => {
      const ms = s.matches.filter((m) => m.candidateId === c.id).sort((a, b) => b.overall - a.overall);
      const best = ms[0];
      return { ...c, best: best ? { ...best, vacancy: s.vacancies.find((v) => v.id === best.vacancyId)?.title } : null, gem: ms.some((m) => m.hiddenGem), potentialGem: ms.some((m) => m.potentialGem), applied: s.apps.filter((a) => a.candidate_id === c.id).map((a) => ({ ...a, vacancy: s.vacancies.find((v) => v.id === a.vacancy_id)?.title })) };
    }));
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(req) {
  const b = await req.json();
  if (!b.full_name || !b.profile_text) return NextResponse.json({ error: 'Name and profile text are required' }, { status: 400 });
  const r = await q('INSERT INTO candidates (full_name, gender, age, school, education, years_experience, phone, channel, accommodations, comm_pref, profile_text) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [b.full_name, b.gender || null, Number(b.age) || null, b.school || null, b.education || null, Number(b.years_experience) || 0, b.phone || null, b.channel || 'web', b.accommodations || null, b.comm_pref || 'Phone call', b.profile_text]);
  if (b.vacancy_id) await q('INSERT INTO applications (candidate_id, vacancy_id, source, status) VALUES (?,?,?,?)', [r.insertId, Number(b.vacancy_id), 'applied', 'Received']);
  return NextResponse.json({ id: r.insertId, ref: 'TL-' + (1000 + r.insertId) });
}
