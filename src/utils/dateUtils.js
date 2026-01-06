export const getDaysUntil = (targetDate) => {
  const diff = new Date(targetDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const EXAM_DATES = [
  { name: 'SBI PO 2026', date: '2026-11-01', color: 'text-blue-400' },
  { name: 'IBPS PO 2026', date: '2026-10-15', color: 'text-emerald-400' },
  { name: 'RBI Grade B', date: '2026-09-10', color: 'text-purple-400' },
];