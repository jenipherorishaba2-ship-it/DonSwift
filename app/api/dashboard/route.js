import { NextResponse } from 'next/server';
import { loadState } from '@/lib/state';
import { q } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const s = await loadState();
    const [chat] = await q('SELECT COUNT(*) AS n FROM chat_logs');
    const gems = s.matches.filter((m) => m.hiddenGem);
    const crossMatches = s.matches.filter((m) => m.band === 'Strong' && !s.apps.some((a) => a.candidate_id === m.candidateId && a.vacancy_id === m.vacancyId));
    const name = (id) => s.candidates.find((c) => c.id === id);
    const vac = (id) => s.vacancies.find((v) => v.id === id);
    // ---- Fairness & inclusion monitor ----
    const SHORT = ['Shortlisted', 'Interview', 'Hired'];
    const top = s.vacancies.flatMap((v) => s.matches.filter((m) => m.vacancyId === v.id).sort((a, b) => b.overall - a.overall).slice(0, 3));
    const cOf = (id) => s.candidates.find((c) => c.id === id);
    const noDegree = (c) => !/bachelor|degree|bsc|bcom|cpa/i.test(c.education || '');
    const shortlisted = s.apps.filter((a) => SHORT.includes(a.status)).map((a) => cOf(a.candidate_id));
    const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
    const fairness = {
      womenPool: pct(s.candidates.filter((c) => c.gender === 'Female').length, s.candidates.length),
      womenShortlist: shortlisted.length ? pct(shortlisted.filter((c) => c.gender === 'Female').length, shortlisted.length) : null,
      shortlistedCount: shortlisted.length,
      noDegreeTop: pct(top.filter((m) => noDegree(cOf(m.candidateId))).length, top.length),
      altChannel: pct(s.candidates.filter((c) => c.channel !== 'web').length, s.candidates.length),
      withAdjustments: s.candidates.filter((c) => c.accommodations).length,
      adjustmentsInTop: new Set(top.filter((m) => cOf(m.candidateId).accommodations).map((m) => m.candidateId)).size,
      gemsInTop: top.filter((m) => m.hiddenGem).length,
    };
    return NextResponse.json({
      fairness,
      vacancies: s.vacancies.map(({ blueprint, description, blueprint_json, ...v }) => ({ ...v, topMatches: s.matches.filter((m) => m.vacancyId === v.id).sort((a, b) => b.overall - a.overall).slice(0, 3).map((m) => ({ ...m, name: name(m.candidateId).full_name, ref: name(m.candidateId).ref })) })),
      stats: {
        candidates: s.candidates.length,
        applications: s.apps.length,
        hiddenGems: gems.length,
        crossMatches: crossMatches.length,
        pending: s.apps.filter((a) => ['Received', 'Screening'].includes(a.status)).length,
        chats: chat.n,
        decisions: s.decisions.length,
        overrides: s.decisions.filter((d) => d.is_override).length,
      },
      gems: gems.map((m) => ({ ...m, name: name(m.candidateId).full_name, ref: name(m.candidateId).ref, vacancy: vac(m.vacancyId).title })),
      cross: crossMatches.map((m) => ({ ...m, name: name(m.candidateId).full_name, ref: name(m.candidateId).ref, vacancy: vac(m.vacancyId).title })),
      recent: s.decisions.slice(0, 6).map((d) => ({ ...d, name: name(d.candidate_id)?.full_name, ref: name(d.candidate_id)?.ref, vacancy: vac(d.vacancy_id)?.title })),
    });
  } catch (e) {
    // ---- Fairness & inclusion monitor ----
    const SHORT = ['Shortlisted', 'Interview', 'Hired'];
    const top = s.vacancies.flatMap((v) => s.matches.filter((m) => m.vacancyId === v.id).sort((a, b) => b.overall - a.overall).slice(0, 3));
    const cOf = (id) => s.candidates.find((c) => c.id === id);
    const noDegree = (c) => !/bachelor|degree|bsc|bcom|cpa/i.test(c.education || '');
    const shortlisted = s.apps.filter((a) => SHORT.includes(a.status)).map((a) => cOf(a.candidate_id));
    const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
    const fairness = {
      womenPool: pct(s.candidates.filter((c) => c.gender === 'Female').length, s.candidates.length),
      womenShortlist: shortlisted.length ? pct(shortlisted.filter((c) => c.gender === 'Female').length, shortlisted.length) : null,
      shortlistedCount: shortlisted.length,
      noDegreeTop: pct(top.filter((m) => noDegree(cOf(m.candidateId))).length, top.length),
      altChannel: pct(s.candidates.filter((c) => c.channel !== 'web').length, s.candidates.length),
      withAdjustments: s.candidates.filter((c) => c.accommodations).length,
      adjustmentsInTop: new Set(top.filter((m) => cOf(m.candidateId).accommodations).map((m) => m.candidateId)).size,
      gemsInTop: top.filter((m) => m.hiddenGem).length,
    };
    return NextResponse.json({
      fairness, error: 'Database error: ' + e.message + '. Is XAMPP MySQL running and talentlens imported?' }, { status: 500 });
  }
}
