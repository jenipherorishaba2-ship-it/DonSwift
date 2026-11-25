import { q } from './db';
import { extractSkills, buildBlueprint, match, rag } from './engine';

const parse = (v) => { if (!v) return null; if (typeof v === 'object') return v; try { return JSON.parse(v); } catch { return null; } };

// Loads everything and computes matches for every candidate x every vacancy.
export async function loadState() {
  const [vacs, cands, results, apps, decisions] = await Promise.all([
    q('SELECT * FROM vacancies ORDER BY deadline ASC'),
    q('SELECT * FROM candidates ORDER BY id ASC'),
    q('SELECT * FROM challenge_results ORDER BY id ASC'),
    q('SELECT * FROM applications'),
    q('SELECT * FROM decisions ORDER BY created_at DESC, id DESC'),
  ]);
  const vacancies = vacs.map((v) => ({ ...v, blueprint: parse(v.blueprint_json) || buildBlueprint(v.description) }));
  const candidates = cands.map((c) => ({ ...c, ref: 'TL-' + String(1000 + c.id), skills: extractSkills(c.profile_text) }));
  const chal = {};
  for (const r of results) chal[`${r.candidate_id}-${r.vacancy_id}`] = r.score; // latest wins
  const matches = [];
  for (const c of candidates) for (const v of vacancies) matches.push(match(c, v, chal[`${c.id}-${v.id}`]));
  for (const v of vacancies) {
    const short = apps.filter((a) => a.vacancy_id === v.id && ['Shortlisted', 'Interview', 'Hired'].includes(a.status)).length;
    v.shortlisted = short;
    v.applicants = apps.filter((a) => a.vacancy_id === v.id).length;
    v.rag = rag(v, short);
  }
  return { vacancies, candidates, matches, apps, decisions, chal };
}

export function anonymise(c, i) {
  return { ...c, full_name: `Candidate ${c.ref}`, gender: '—', age: '—', school: 'Hidden', phone: 'Hidden' };
}
