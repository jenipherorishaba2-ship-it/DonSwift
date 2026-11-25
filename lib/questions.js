// Scenario-based questions: test what people DO, not what they claim.
// a = index of the correct option.
export const BANK = {
  customer_service: [
    { q: 'A customer shouts that they were overcharged. The queue is long. What do you do first?', o: ['Tell them to wait until the queue ends', 'Listen calmly, check the receipt, and fix it if we made a mistake', 'Call security', 'Refund them immediately without checking'], a: 1 },
    { q: 'A regular customer asks for an item that is out of stock. Best response?', o: ['"We don\'t have it."', 'Offer a similar item or take their number and call when it arrives', 'Send them to a competitor', 'Ignore the request'], a: 1 },
  ],
  sales: [
    { q: 'A customer says "Your price is too high." Best first move?', o: ['Reduce the price immediately', 'Explain the value and ask what they are comparing with', 'Tell them to go elsewhere', 'Say nothing'], a: 1 },
    { q: 'You sold 40 items last week. Target is 10% more this week. How many?', o: ['40', '44', '50', '41'], a: 1 },
  ],
  cash_handling: [
    { q: 'Till should have UGX 500,000. You count 480,000 and find a 20,000 mobile money receipt not recorded. The till is…', o: ['Short by 20,000', 'Balanced', 'Over by 20,000', 'Short by 40,000'], a: 1 },
    { q: 'Customer pays 50,000 for goods worth 37,500. Change?', o: ['12,500', '13,500', '22,500', '7,500'], a: 0 },
  ],
  negotiation: [
    { q: 'A supplier offers 10 bales at 120,000 each. Your budget is 1,100,000. Best offer?', o: ['Accept 1,200,000', 'Offer 1,050,000 for all 10 and commit to repeat orders', 'Walk away silently', 'Buy only 5'], a: 1 },
  ],
  stock_control: [
    { q: 'Opening stock 120, received 60, sold 150. Closing count is 25. What is the discrepancy?', o: ['None', '5 missing', '5 extra', '30 missing'], a: 1 },
    { q: 'Which items should be sold first in a shop with perishables?', o: ['Newest stock', 'Oldest stock first (FIFO)', 'Most expensive', 'Random'], a: 1 },
  ],
  communication: [
    { q: 'A client delivery will be 2 days late. Best message?', o: ['Say nothing until they ask', 'Inform them early, give the new date and what you are doing about it', 'Blame the driver', 'Cancel the order'], a: 1 },
  ],
  team_leadership: [
    { q: 'Two cashiers are arguing on a busy Saturday. What do you do?', o: ['Let them sort it out', 'Separate them calmly, keep service running, then resolve it privately after the rush', 'Fire both', 'Join the argument'], a: 1 },
  ],
  accounting: [
    { q: 'In double-entry bookkeeping, buying stock on credit affects…', o: ['Stock and Cash', 'Stock and Payables (creditors)', 'Sales and Cash', 'Only Stock'], a: 1 },
    { q: 'Bank statement shows 2,000,000; cash book 1,850,000. An unpresented cheque is 150,000. Reconciled?', o: ['Yes', 'No, 150,000 difference', 'No, 300,000 difference', 'Cannot tell'], a: 0 },
  ],
  excel: [
    { q: 'Which formula adds cells A1 to A10?', o: ['=ADD(A1:A10)', '=SUM(A1:A10)', '=TOTAL(A1-A10)', '=A1+A10'], a: 1 },
  ],
  taxation: [
    { q: 'VAT in Uganda is 18%. VAT on a 100,000 (excl. VAT) invoice?', o: ['18,000', '1,800', '15,254', '118,000'], a: 0 },
  ],
  attention_to_detail: [
    { q: 'Which invoice number is out of sequence: 1041, 1042, 1044, 1043, 1045?', o: ['1041', '1044', '1045', 'None'], a: 1 },
  ],
  logistics: [
    { q: 'A truck breaks down with 3 urgent deliveries. Best plan?', o: ['Wait for repair', 'Inform clients, re-route urgent drops to another vehicle/boda, then repair', 'Cancel deliveries', 'Deliver tomorrow without telling anyone'], a: 1 },
  ],
  scheduling: [
    { q: '5 staff, shop open 7 days, each works max 5 days. Minimum staff on each day if spread evenly?', o: ['2', '3', '4', '5'], a: 1 },
  ],
  record_keeping: [
    { q: 'You find a receipt you forgot to record yesterday. What do you do?', o: ['Throw it away', 'Record it with the correct date and note the late entry', 'Add it to today silently', 'Ignore it'], a: 1 },
  ],
  problem_solving: [
    { q: 'Sales dropped 30% this month at one branch only. First step?', o: ['Fire the manager', 'Compare with other branches and check what changed (stock, staff, competitors)', 'Cut prices everywhere', 'Do nothing'], a: 1 },
  ],
  health_safety: [
    { q: 'You see a wet floor near the loading bay. What should happen?', o: ['Ignore it', 'Mark it with a sign and clean it immediately', 'Wait for the cleaner tomorrow', 'Tell customers to walk faster'], a: 1 },
  ],
};

export function questionsFor(blueprint) {
  const out = [];
  for (const s of blueprint.skills) {
    for (const [i, item] of (BANK[s.id] || []).entries()) out.push({ id: `${s.id}:${i}`, skill: s.label, q: item.q, o: item.o });
  }
  return out.slice(0, 10);
}

export function grade(answers) {
  let correct = 0, total = 0; const bySkill = {};
  for (const [id, ans] of Object.entries(answers || {})) {
    const [sid, i] = id.split(':'); const item = BANK[sid]?.[Number(i)]; if (!item) continue;
    total++; const ok = Number(ans) === item.a; if (ok) correct++;
    bySkill[sid] = bySkill[sid] || { correct: 0, total: 0 }; bySkill[sid].total++; if (ok) bySkill[sid].correct++;
  }
  return { score: total ? Math.round((correct / total) * 100) : 0, correct, total, bySkill };
}
