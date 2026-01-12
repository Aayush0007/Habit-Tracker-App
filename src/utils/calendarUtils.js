export const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
export const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

export const getMonthName = (monthIndex) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthIndex];
};

export const getStatusColor = (status) => {
  const statusMap = {
    'elite': 'bg-purple-600 border-purple-400/50 shadow-[0_0_10px_rgba(147,51,234,0.3)]',
    'target': 'bg-emerald-600 border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]',
    'partial': 'bg-amber-600 border-amber-400/50',
    'missed': 'bg-rose-600 border-rose-400/50',
    'none': 'bg-slate-900 border-slate-800 text-slate-700'
  };
  return statusMap[status] || statusMap['none'];
};