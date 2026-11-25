// Skills taxonomy: each skill has synonyms that count as DIRECT evidence.
export const SKILLS = {
  accounting: { label: 'Accounting & bookkeeping', cat: 'Finance', syn: ['accounting', 'bookkeeping', 'book keeping', 'ledger', 'financial statements', 'reconciliation', 'reconciliations', 'accounts'] },
  excel: { label: 'Excel / spreadsheets', cat: 'Digital', syn: ['excel', 'spreadsheet', 'spreadsheets'] },
  cpa: { label: 'CPA / ACCA certification', cat: 'Credential', syn: ['cpa', 'acca', 'certified public accountant'] },
  taxation: { label: 'Tax (VAT, PAYE)', cat: 'Finance', syn: ['tax', 'vat', 'paye', 'ura'] },
  accounting_software: { label: 'Accounting software', cat: 'Digital', syn: ['quickbooks', 'sage', 'tally', 'accounting software'] },
  customer_service: { label: 'Customer service', cat: 'People', syn: ['customer service', 'customer care', 'client service', 'front desk', 'customer-focused', 'customers'] },
  sales: { label: 'Sales', cat: 'Commercial', syn: ['sales', 'selling', 'sold', 'salesperson', 'targets'] },
  cash_handling: { label: 'Cash handling & payments', cat: 'Finance', syn: ['cash handling', 'cashier', 'till', 'mobile money', 'cash'] },
  negotiation: { label: 'Negotiation', cat: 'Commercial', syn: ['negotiation', 'negotiate', 'negotiated', 'bargain', 'bargaining'] },
  communication: { label: 'Communication', cat: 'People', syn: ['communication', 'presentation', 'public speaking', 'communicate', 'report writing'] },
  stock_control: { label: 'Stock control & inventory', cat: 'Operations', syn: ['stock control', 'inventory', 'stock', 'store keeper', 'storekeeper', 'stores', 'warehouse'] },
  logistics: { label: 'Logistics & dispatch', cat: 'Operations', syn: ['logistics', 'deliveries', 'delivery', 'dispatch', 'dispatched', 'supply chain', 'fleet'] },
  team_leadership: { label: 'Team leadership', cat: 'Leadership', syn: ['team leader', 'leadership', 'supervise', 'supervised', 'supervisor', 'lead and supervise', 'managed a team', 'led a team', 'coordinated'] },
  teamwork: { label: 'Teamwork', cat: 'People', syn: ['teamwork', 'team player', 'collaborate'] },
  problem_solving: { label: 'Problem solving', cat: 'Thinking', syn: ['problem solving', 'solve problems', 'troubleshoot', 'resolved'] },
  record_keeping: { label: 'Record keeping & data entry', cat: 'Admin', syn: ['record keeping', 'data entry', 'records', 'filing', 'typing'] },
  computer_literacy: { label: 'Computer literacy', cat: 'Digital', syn: ['computer', 'ms office', 'microsoft office', 'email'] },
  scheduling: { label: 'Planning & scheduling', cat: 'Operations', syn: ['scheduling', 'schedule', 'planning', 'plan deliveries', 'roster', 'timetable', 'organised', 'organized'] },
  marketing: { label: 'Marketing & social media', cat: 'Commercial', syn: ['marketing', 'social media', 'promotion', 'promotions', 'advertising', 'facebook', 'instagram', 'tiktok'] },
  driving: { label: 'Driving', cat: 'Operations', syn: ['driving permit', 'driving'] },
  languages: { label: 'Local languages', cat: 'People', syn: ['luganda', 'swahili', 'runyankole', 'luo', 'french'] },
  attention_to_detail: { label: 'Attention to detail', cat: 'Thinking', syn: ['attention to detail', 'accuracy', 'accurate', 'detail-oriented'] },
  time_management: { label: 'Time management', cat: 'Thinking', syn: ['time management', 'punctual', 'deadlines'] },
  health_safety: { label: 'Health & safety', cat: 'Operations', syn: ['health and safety', 'safety', 'first aid'] },
};

// Transferable experience: everyday / informal experience that PROVES a skill
// even when the candidate never writes the "keyword".
export const TRANSFERABLE = [
  { phrases: ['market stall', 'market vendor', 'stall', 'kiosk', 'duka', 'my shop', 'owino', 'kikuubo'], skills: ['cash_handling', 'negotiation', 'stock_control', 'customer_service', 'sales'], why: 'Running a market stall' },
  { phrases: ['boda boda', 'boda'], skills: ['driving', 'logistics', 'customer_service', 'cash_handling', 'time_management'], why: 'Boda boda riding' },
  { phrases: ['choir'], skills: ['teamwork', 'communication'], why: 'Singing in a choir' },
  { phrases: ['youth leader', 'prefect', 'captain', 'chairperson', 'guild'], skills: ['team_leadership', 'communication'], why: 'Leadership role' },
  { phrases: ['savings group', 'sacco', 'vsla', 'treasurer'], skills: ['accounting', 'cash_handling', 'attention_to_detail'], why: 'Treasurer / savings group' },
  { phrases: ['mobile money agent'], skills: ['cash_handling', 'customer_service', 'attention_to_detail', 'record_keeping'], why: 'Mobile money agent' },
  { phrases: ['farm', 'poultry', 'farming'], skills: ['stock_control', 'scheduling', 'problem_solving', 'sales'], why: 'Running a farm' },
  { phrases: ['kept a notebook', 'notebook of', 'kept records', 'tracked'], skills: ['record_keeping', 'stock_control'], why: 'Keeping manual records' },
  { phrases: ['come back to us', 'treat them well', 'served about'], skills: ['customer_service'], why: 'Repeat customers' },
  { phrases: ['volunteer', 'events', 'wedding committee'], skills: ['scheduling', 'teamwork'], why: 'Organising events/volunteers' },
  { phrases: ['hardware shop', 'shop'], skills: ['customer_service', 'stock_control'], why: 'Shop work' },
  { phrases: ['salon', 'tailoring', 'tailor'], skills: ['customer_service', 'attention_to_detail', 'sales'], why: 'Salon / tailoring work' },
  { phrases: ['coach', 'tutor', 'taught'], skills: ['communication', 'team_leadership'], why: 'Coaching / teaching' },
  { phrases: ['content creator', 'youtube'], skills: ['marketing', 'communication'], why: 'Content creation' },
];

export const BEHAVIOURS = {
  integrity: ['integrity', 'honest', 'honesty', 'trustworthy'],
  reliability: ['reliable', 'dependable', 'punctual'],
  initiative: ['initiative', 'self-motivated', 'proactive'],
  'customer focus': ['customer-focused', 'customer focus'],
  'attention to detail': ['attention to detail', 'detail-oriented'],
  resilience: ['resilience', 'under pressure', 'resilient'],
};

// Practical "proof of skill" task templates per skill (shown on the blueprint)
export const TASKS = {
  accounting: 'Post 10 transactions to a ledger and produce a trial balance (15 min)',
  excel: 'Clean a messy sales sheet and build a SUM/IF summary (10 min)',
  taxation: 'Compute VAT on 5 invoices and spot the wrong one (10 min)',
  customer_service: 'Role-play: calm an angry customer whose order is late (5 min)',
  sales: 'Sell a product to the panel in 3 minutes, handle 2 objections',
  cash_handling: 'Reconcile a till float with 3 hidden errors (10 min)',
  negotiation: 'Negotiate a supplier price down within a set budget (5 min)',
  stock_control: 'Find the stock discrepancy in a 20-line inventory sheet (10 min)',
  logistics: 'Plan a delivery route for 6 drops with 2 vehicles (10 min)',
  team_leadership: 'Scenario: two staff are in conflict on a busy day. What do you do?',
  scheduling: 'Build a weekly shift roster for 5 people with constraints (10 min)',
  record_keeping: 'Enter 15 records from handwritten receipts with no errors (10 min)',
  problem_solving: 'Case: the truck broke down with 3 urgent deliveries. Plan B? (5 min)',
  communication: 'Write a 5-line message to a client explaining a delay',
  marketing: 'Draft a social media post for a weekend promotion',
  health_safety: 'Spot 5 safety hazards in a warehouse photo',
};
