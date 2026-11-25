import { SKILLS, TRANSFERABLE, BEHAVIOURS, TASKS } from './taxonomy';

const norm = (t) => ' ' + String(t || '').toLowerCase().replace(/[^a-z0-9\-\s]/g, ' ').replace(/\s+/g, ' ') + ' ';
const has = (text, phrase) => text.includes(' ' + phrase.toLowerCase() + ' ') || text.includes(' ' + phrase.toLowerCase() + 's ');

// ---------- 1. Skill extraction (direct + transferable) ----------
export function extractSkills(profileText) {
  const t = norm(profileText);
  const found = {};
  for (const [id, s] of Object.entries(SKILLS)) {
    const hit = s.syn.find((p) => has(t, p));
    if (hit) found[id] = { id, label: s.label, cat: s.cat, type: 'direct', evidence: `mentions "${hit}"` };
  }
  for (const tr of TRANSFERABLE) {
    const hit = tr.phrases.find((p) => has(t, p));
    if (!hit) continue;
    for (const id of tr.skills) {
      if (found[id]) continue;
      found[id] = { id, label: SKILLS[id].label, cat: SKILLS[id].cat, type: 'transferable', evidence: `${tr.why} ("${hit}")` };
    }
  }
  return Object.values(found);
}

// ---------- 2. Vacancy Decoder: JD -> weighted competency blueprint ----------
export function buildBlueprint(description) {
  const lines = String(description || '').split(/\n|\.(?=\s)/).map((l) => l.trim()).filter(Boolean);
  const skills = {};
  for (const line of lines) {
    const t = norm(line);
    const isNice = /advantage|added|preferred|desirable|nice to have|bonus/.test(t);
    const isMust = /must|required|requirement|essential|minimum|key/.test(t);
    for (const [id, s] of Object.entries(SKILLS)) {
      const terms = s.syn.filter((p) => has(t, p));
      if (!terms.length) continue;
      const level = isNice ? 'nice' : isMust ? 'must' : 'core';
      const prev = skills[id];
      const rank = { must: 3, core: 2, nice: 1 };
      const allTerms = [...new Set([...(prev?.terms || []), ...terms])];
      if (!prev || rank[level] > rank[prev.level]) skills[id] = { id, label: s.label, cat: s.cat, level, weight: rank[level], terms: allTerms };
      else prev.terms = allTerms;
    }
  }
  // Credentials are recorded but deliberately down-weighted: they are signals, not gates.
  const credentials = [];
  const d = norm(description);
  if (/degree|bachelor/.test(d)) credentials.push('Degree mentioned');
  if (/diploma/.test(d)) credentials.push('Diploma mentioned');
  const yrs = d.match(/(\d+)\s*(\+\s*)?years?/);
  if (yrs) credentials.push(`${yrs[1]}+ years experience mentioned`);
  if (skills.cpa) { skills.cpa.weight = 1; skills.cpa.level = 'credential'; }

  const behaviours = Object.entries(BEHAVIOURS).filter(([, syn]) => syn.some((p) => has(d, p))).map(([b]) => b);
  const list = Object.values(skills).sort((a, b) => b.weight - a.weight);
  const tasks = list.filter((s) => TASKS[s.id]).slice(0, 3).map((s) => ({ skill: s.label, task: TASKS[s.id] }));
  return {
    skills: list,
    behaviours,
    credentials,
    tasks,
    humanOnly: ['Character & integrity (reference checks)', 'Culture & team fit (interview)', 'Final hiring decision'],
  };
}

// ---------- 3. Traditional CV score (what a keyword ATS would see) ----------
export function cvScore(candidate, blueprint) {
  const t = norm(candidate.profile_text);
  const sk = blueprint.skills;
  if (!sk.length) return 0;
  // A keyword filter only recognises the exact words used in the job description.
  const hits = sk.filter((s) => (s.terms || SKILLS[s.id].syn).some((p) => has(t, p))).length;
  let score = (hits / sk.length) * 70;
  const edu = norm(candidate.education);
  if (/bachelor|degree|bsc|bcom|cpa/.test(edu)) score += 20; else if (/diploma/.test(edu)) score += 10;
  if ((candidate.years_experience || 0) >= 2 && hits > 0) score += 10;
  return Math.min(100, Math.round(score));
}

// ---------- 4. Explainable match ----------
export function match(candidate, vacancy, challengeScore) {
  const bp = vacancy.blueprint;
  const cSkills = candidate.skills;
  const byId = Object.fromEntries(cSkills.map((s) => [s.id, s]));
  let total = 0, got = 0;
  const matched = [], missing = [];
  for (const s of bp.skills) {
    total += s.weight;
    const c = byId[s.id];
    if (c) {
      const credit = c.type === 'direct' ? 1 : 0.75;
      got += s.weight * credit;
      matched.push({ ...s, type: c.type, evidence: c.evidence });
    } else missing.push(s);
  }
  const skillFit = total ? Math.round((got / total) * 100) : 0;
  const cv = cvScore(candidate, bp);
  const hasCh = challengeScore !== null && challengeScore !== undefined;
  const overall = hasCh ? Math.round(skillFit * 0.45 + challengeScore * 0.55) : skillFit;
  const band = overall >= 75 ? 'Strong' : overall >= 55 ? 'Possible' : 'Weak';
  const transferableCount = matched.filter((m) => m.type === 'transferable').length;
  const hiddenGem = hasCh && challengeScore >= 80 && cv < 50;
  const potentialGem = !hasCh && skillFit >= 60 && transferableCount >= 2;

  const parts = [];
  const mustTotal = bp.skills.filter((s) => s.level === 'must').length;
  const mustGot = matched.filter((s) => s.level === 'must').length;
  parts.push(`Shows ${matched.length}/${bp.skills.length} blueprint skills${mustTotal ? ` (${mustGot}/${mustTotal} must-haves)` : ''}.`);
  if (transferableCount) {
    const tr = matched.filter((m) => m.type === 'transferable');
    const ex = tr.find((m) => /stall|boda|agent|farm|store/.test(m.evidence)) || tr[0];
    parts.push(`${transferableCount} proven through real-life experience, e.g. ${ex.evidence} → ${ex.label.toLowerCase()}.`);
  }
  if (hasCh) parts.push(`Scored ${challengeScore}% on the practical challenge.`);
  else parts.push('Practical challenge not taken yet.');
  if (missing.length) parts.push(`Gaps: ${missing.slice(0, 3).map((m) => m.label).join(', ')}.`);
  if (hiddenGem) parts.push(`A keyword CV filter would score them only ${cv}% and likely reject them.`);

  return { vacancyId: vacancy.id, candidateId: candidate.id, overall, skillFit, cv, challenge: hasCh ? challengeScore : null, band, hiddenGem, potentialGem, matched, missing, explanation: parts.join(' ') };
}

// ---------- 5. Deadline priority (Red / Amber / Green) ----------
export function rag(vacancy, shortlisted) {
  const days = Math.ceil((new Date(vacancy.deadline) - new Date(new Date().toDateString())) / 86400000);
  const need = vacancy.positions * 2; // aim: 2 shortlisted per position
  let status = 'green';
  if (days <= 5 && shortlisted < need) status = 'red';
  else if (days <= 14 && shortlisted < need) status = 'amber';
  if (days < 0) status = 'red';
  return { days, status, need };
}

// ---------- 6. Candidate feedback (never a silent rejection) ----------
export function feedbackFor(m, vacancyTitle) {
  const tips = m.missing.slice(0, 2).map((s) => s.label);
  return `For ${vacancyTitle}, your strengths were ${m.matched.slice(0, 3).map((s) => s.label.toLowerCase()).join(', ') || 'noted'}.` +
    (tips.length ? ` To be stronger next time, build evidence in: ${tips.join(' and ')}.` : '');
}
