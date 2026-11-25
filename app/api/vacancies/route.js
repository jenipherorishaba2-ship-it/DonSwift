import { NextResponse } from 'next/server';
import { loadState } from '@/lib/state';
import { q } from '@/lib/db';
import { buildBlueprint } from '@/lib/engine';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const s = await loadState();
    return NextResponse.json(s.vacancies.map(({ description, blueprint_json, ...v }) => v));
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(req) {
  const b = await req.json();
  if (!b.title || !b.description || !b.deadline) return NextResponse.json({ error: 'Title, deadline and description are required' }, { status: 400 });
  const bp = b.blueprint || buildBlueprint(b.description);
  const r = await q('INSERT INTO vacancies (title, client, location, positions, deadline, description, blueprint_json) VALUES (?,?,?,?,?,?,?)',
    [b.title, b.client || 'Client', b.location || 'Kampala', Number(b.positions) || 1, b.deadline, b.description, JSON.stringify(bp)]);
  return NextResponse.json({ id: r.insertId });
}
