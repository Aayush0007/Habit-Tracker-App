export const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay();
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'best': return 'bg-purple-500 shadow-[0_0_10px_#a855f7]';
    case 'target': return 'bg-emerald-500 shadow-[0_0_10px_#10b981]';
    case 'partial': return 'bg-amber-500';
    case 'missed': return 'bg-rose-500';
    case 'recovery': return 'bg-slate-500';
    default: return 'bg-slate-800';
  }
};