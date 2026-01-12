export const calculateTotalStudyHours = (sessions) => {
  if (!sessions) return 0;
  // Each slot is 2 hours.
  return sessions.filter(s => s.status === 'completed').length * 2;
};

export const calculateStudyStatus = (totalHours) => {
  if (totalHours >= 10) return { label: 'ELITE STATUS', color: 'text-purple-400' };
  if (totalHours >= 8) return { label: 'TARGET MET', color: 'text-emerald-400' };
  if (totalHours >= 4) return { label: 'PARTIAL LOAD', color: 'text-amber-400' };
  return { label: 'BELOW MINIMUM', color: 'text-rose-400' };
};

export const generateDailySessions = (date, userId) => {
  return Array.from({ length: 6 }, (_, i) => ({
    // Composite ID format: USERID-DATE-SESSIONNUMBER (Prevents duplicates)
    id: `${userId}-${date}-${i + 1}`,
    date: date,
    session_number: i + 1,
    status: 'pending', 
    topic: '',
    user_id: userId
  }));
};