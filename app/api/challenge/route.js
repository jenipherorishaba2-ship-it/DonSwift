import { NextResponse } from 'next/server';
import { loadState } from '@/lib/state';
import { questionsFor, grade } from '@/lib/questions';
import { q } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  const vid = Number(new URL(req.url).searchParams.get('vacancy_id'));
  const s = await loadState();
  const v = s.vacancies.find((x) => x.id === vid);
  if (!v) return NextResponse.json({ error: 'Vacancy not found' }, { status: 404 });
  return NextResponse.json({ vacancy: { id: v.id, title: v.title }, tasks: v.blueprint.tasks, questions: questionsFor(v.blueprint) });
}

export async function POST(req) {
  const b = await req.json();
  const g = grade(b.answers);
  await q('INSERT INTO challenge_results (candidate_id, vacancy_id, score, detail_json) VALUES (?,?,?,?)', [Number(b.candidate_id), Number(b.vacancy_id), g.score, JSON.stringify(g)]);
  await q(`INSERT INTO applications (candidate_id, vacancy_id, source, status) VALUES (?,?,'applied','Challenge done')
           ON DUPLICATE KEY UPDATE status = IF(status IN ('Received','Screening'), 'Challenge done', status)`, [Number(b.candidate_id), Number(b.vacancy_id)]);
  return NextResponse.json(g);
}
