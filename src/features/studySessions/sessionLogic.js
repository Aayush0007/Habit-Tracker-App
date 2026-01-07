// src/features/studySessions/sessionLogic.js

export const SESSION_DURATION_MINS = 120; 

// 1. ADD THIS FUNCTION (The one the error is complaining about)
export const calculateTotalStudyHours = (sessions) => {
  if (!sessions) return 0;
  // Filters sessions that are marked 'completed' and multiplies by 2 hours
  const completedCount = sessions.filter(s => s.status === 'completed').length;
  return completedCount * 2; 
};

// 2. THIS IS THE STATUS LOGIC
export const calculateStudyStatus = (totalMinutes) => {
  const hours = totalMinutes / 60;
  if (hours >= 10) return { label: 'Best Day', color: 'text-purple-400', code: 'best' };
  if (hours >= 8) return { label: 'Target Met', color: 'text-emerald-400', code: 'target' };
  if (hours >= 6) return { label: 'Partial', color: 'text-amber-400', code: 'partial' };
  return { label: 'Missed', color: 'text-rose-400', code: 'missed' };
};

// 3. THIS GENERATES THE 6 SLOTS
// src/features/studySessions/sessionLogic.js

export const generateDailySessions = (date) => {
  return Array.from({ length: 6 }, (_, i) => ({
    // Stable ID tied to date and session number
    id: `${date}-session-${i + 1}`,
    date: date,
    sessionNumber: i + 1,
    status: 'pending', 
    topic: '',
  }));
};
