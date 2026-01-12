export const calculateHabitStatus = (isDone) => {
  return isDone ? 'MISSION ACCOMPLISHED' : 'INCOMPLETE';
};

/**
 * Streak Protection Logic:
 * If a day is marked as 'Recovery', the streak is paused/protected 
 * instead of resetting to 0.
 */
export const calculateStreak = (logs) => {
  let streak = 0;
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

  for (const log of sortedLogs) {
    if (log.workout_done && log.revision_done) {
      streak++;
    } else if (log.is_recovery_day) {
      continue; // Skip but don't break the streak
    } else {
      break; // Streak broken
    }
  }
  return streak;
};