import { NextResponse } from 'next/server';
import { loadState } from '@/lib/state';
import { feedbackFor } from '@/lib/engine';
import { q } from '@/lib/db';
export const dynamic = 'force-dynamic';

const INTENTS = [
  ['accessibility', /deaf|sign language|disab|wheelchair|blind|interpreter|hearing|cannot (hear|see|read|write)|accessib/],
  ['greeting', /^(hi|hello|hey|good (morning|afternoon|evening)|oli otya)\b/],
  ['status', /status|moved|update|progress|application|applied|news|hear back|shortlist/],
  ['feedback', /why|reject|not selected|feedback|improve|unsuccessful/],
  ['jobs', /jobs?|vacanc|opening|opportunit|hiring|position|fit|suit/],
  ['challenge', /challenge|test|assessment|exam|proof/],
  ['apply', /how (do|can) i apply|apply|cv|resume|register|documents?/],
  ['deadline', /deadline|when|closing|how long/],
  ['interview', /interview|meet|panel/],
  ['human', /human|person|recruiter|call|talk to|speak/],
];

export async function POST(req) {
  const { message = '', ref = '' } = await req.json();
  const s = await loadState();
  const text = message.toLowerCase();
  const refMatch = (ref + ' ' + message).match(/tl-?\s?(\d{4})/i);
  const phoneMatch = (ref + ' ' + message).match(/0\d{9}/);
  const cand = refMatch ? s.candidates.find((c) => c.id === Number(refMatch[1]) - 1000) : phoneMatch ? s.candidates.find((c) => c.phone === phoneMatch[0]) : null;
  let intent = (INTENTS.find(([, re]) => re.test(text)) || ['fallback'])[0];
  if (intent === 'greeting' && text.split(' ').length > 3) intent = (INTENTS.slice(1).find(([, re]) => re.test(text)) || ['greeting'])[0];
  const vt = (id) => s.vacancies.find((v) => v.id === id)?.title;
  const first = cand ? cand.full_name.split(' ')[0] : '';
  let answer = '';

  const needRef = 'Please share your reference number (e.g. TL-1001) or the phone number you applied with, and I will check for you.';
  const myMatches = cand ? s.matches.filter((m) => m.candidateId === cand.id).sort((a, b) => b.overall - a.overall) : [];

  switch (intent) {
    case 'greeting':
      answer = `Hello${first ? ' ' + first : ''}! I am the Donswift TalentLens assistant, available 24/7. Ask me about your application status, open jobs, the skills challenge or interviews.`; break;
    case 'status': {
      if (!cand) { answer = needRef; break; }
      const apps = s.apps.filter((a) => a.candidate_id === cand.id);
      answer = `Hi ${first}, here is your progress:\n` + apps.map((a) => `• ${vt(a.vacancy_id)}: ${a.status}${a.source === 'ai_match' ? ' (a recruiter matched you to this role)' : ''}`).join('\n');
      const extra = myMatches.filter((m) => m.band !== 'Weak' && !apps.some((a) => a.vacancy_id === m.vacancyId));
      if (extra.length) answer += `\n\nGood news: your skills also fit ${extra.map((m) => `${vt(m.vacancyId)} (${m.overall}% match)`).join(', ')}. A recruiter will review this.`;
      break;
    }
    case 'feedback': {
      if (!cand) { answer = needRef; break; }
      const rejected = s.apps.filter((a) => a.candidate_id === cand.id && a.status === 'Not selected');
      const target = rejected[0] ? myMatches.find((m) => m.vacancyId === rejected[0].vacancy_id) : myMatches[myMatches.length - 1];
      answer = feedbackFor(target, vt(target.vacancyId));
      const best = myMatches[0];
      if (best && best.vacancyId !== target.vacancyId) answer += `\n\nYour strongest fit right now is ${vt(best.vacancyId)} (${best.overall}%).`;
      break;
    }
    case 'jobs': {
      const open = s.vacancies.filter((v) => v.rag.days >= 0);
      if (cand) answer = `${first}, based on your skills these are your best matches:\n` + myMatches.slice(0, 3).map((m) => `• ${vt(m.vacancyId)}: ${m.overall}% (${m.band})`).join('\n');
      else answer = 'Open vacancies:\n' + open.map((v) => `• ${v.title} (${v.location}), closes in ${v.rag.days} days`).join('\n') + '\n\nShare your reference number and I will tell you which ones fit you best.';
      break;
    }
    case 'challenge':
      answer = 'Every role has a short practical challenge (10 to 20 minutes) built from the job\'s real tasks. It lets you show what you can DO, even if your CV is short. Open the "Skills Challenge" page, choose your name and the job, and answer the scenarios. Your score goes straight to the recruiter.'; break;
    case 'apply':
      answer = 'You can apply with a CV, OR without one: just tell us in your own words what work you have done (selling, farming, driving, running a stall, leading a group all count). We pick out your skills automatically. Use the "Apply" form or send your story by WhatsApp.'; break;
    case 'deadline':
      answer = 'Closing dates:\n' + s.vacancies.map((v) => `• ${v.title}: ${v.deadline} (${v.rag.days} days left)`).join('\n') + '\nWe update every applicant within 48 hours of the closing date.'; break;
    case 'interview': {
      const iv = cand ? s.apps.filter((a) => a.candidate_id === cand.id && ['Shortlisted', 'Interview'].includes(a.status)) : [];
      answer = iv.length ? `${first}, you are shortlisted for ${iv.map((a) => vt(a.vacancy_id)).join(', ')}. ${cand.comm_pref && cand.comm_pref !== 'Phone call' ? `A recruiter will contact you by ${cand.comm_pref} to agree an interview time.` : 'A recruiter will call you to agree an interview time.'}${cand.accommodations ? ' Your adjustments (' + cand.accommodations + ') will be arranged.' : ''} Interviews are always done by a real person.` : 'Interviews are only for shortlisted candidates and are always done by a human recruiter. ' + (cand ? 'You are not shortlisted yet; I will update you as soon as that changes.' : needRef);
      break;
    }
    case 'accessibility':
      answer = `${first ? first + ', y' : 'Y'}es, absolutely. Donswift welcomes candidates with disabilities. You can apply by text, by speaking (voice), or by sending a sign language video. Tell us any adjustments you need on the Apply form: a Ugandan Sign Language interpreter, step-free venue, large print, screen reader or extra time. This is only used to prepare for you and never affects your score.` + (cand?.accommodations ? `\n\nWe have noted for you: ${cand.accommodations}. We will contact you by ${cand.comm_pref}.` : ''); break;
    case 'human':
      answer = `No problem. I have flagged your request and a Donswift recruiter will ${cand?.comm_pref && cand.comm_pref !== 'Phone call' ? 'contact you by ' + cand.comm_pref : 'call you back'} within 1 working day (Mon to Fri, 8am to 5pm).`; break;
    default:
      answer = cand ? `Thanks ${first}. I can help with: application status, why you were not selected, other jobs that fit you, the skills challenge and interviews. What would you like to know?` : 'I can help with application status, open jobs, how to apply, the skills challenge and interviews. ' + needRef;
  }
  try { await q('INSERT INTO chat_logs (candidate_id, question, answer, intent) VALUES (?,?,?,?)', [cand?.id || null, message, answer, intent]); } catch {}
  return NextResponse.json({ answer, intent, candidate: cand ? { ref: cand.ref, name: cand.full_name } : null });
}
