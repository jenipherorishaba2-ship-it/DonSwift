import { NextResponse } from 'next/server';
import { buildBlueprint } from '@/lib/engine';
export async function POST(req) {
  const { description } = await req.json();
  return NextResponse.json(buildBlueprint(description));
}
