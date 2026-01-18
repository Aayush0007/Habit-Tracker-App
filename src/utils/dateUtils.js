export const EXAM_DATES = [
  { name: 'AFCAT 1', date: '2026-01-31', color: 'text-blue-400' },
  { name: 'SBI PO Pre', date: '2026-08-01', color: 'text-emerald-400' },
  { name: 'IBPS PO Pre', date: '2026-08-22', color: 'text-emerald-500' },
  { name: 'AFCAT 2', date: '2026-08-23', color: 'text-blue-500' },
  { name: 'IBPS SO Pre', date: '2026-08-29', color: 'text-indigo-400' },
  { name: 'RRB NTPC', date: '2026-08-15', color: 'text-orange-400' },
  { name: 'RPSC Comp', date: '2026-08-25', color: 'text-purple-400' },
  { name: 'SBI PO Mains', date: '2026-09-12', color: 'text-emerald-600' },
  { name: 'SBI Clerk Pre', date: '2026-09-27', color: 'text-cyan-400' },
  { name: 'IBPS PO Mains', date: '2026-10-04', color: 'text-emerald-700' },
  { name: 'IBPS Clerk Pre', date: '2026-10-10', color: 'text-cyan-500' },
  { name: 'RBI Grade B', date: '2026-10-20', color: 'text-amber-500' },
  { name: 'IBPS SO Mains', date: '2026-11-01', color: 'text-indigo-600' },
  { name: 'IBPS Clerk Main', date: '2026-12-27', color: 'text-cyan-700' },
  { name: 'RRB PO Pre', date: '2026-11-21', color: 'text-rose-400' },
  { name: 'RRB Clerk Pre', date: '2026-12-06', color: 'text-rose-500' },
  { name: 'RRB PO Mains', date: '2026-12-20', color: 'text-rose-600' },
  { name: 'NABARD Gr A', date: '2026-12-25', color: 'text-lime-500' },
  { name: 'SEBI Gr A', date: '2027-01-15', color: 'text-indigo-400' },
  { name: 'RRB Clerk Mains', date: '2027-01-30', color: 'text-rose-700' },
];
export const getDaysUntil = (dateString) => {
  const target = new Date(dateString);
  const now = new Date();
  // Reset time to midnight for accurate day calculation
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diff = target - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

/**
 * Ensures consistent date strings across the app to prevent 
 * timezone shifting in Supabase queries.
 */
export const getSystemDate = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};