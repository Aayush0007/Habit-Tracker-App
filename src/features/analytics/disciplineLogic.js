export const calculateDisciplineScore = (logs) => {
  if (!logs || logs.length === 0) return 0;
  
  // Discipline = (Successful Days / Total Days) * 100
  // A day is successful if both Workout and Revision are completed
  const successfulDays = logs.filter(log => log.workout_done && log.revision_done).length;
  return Math.round((successfulDays / logs.length) * 100);
};

export const getIdentityLevel = (totalHours) => {
  if (totalHours >= 1000) return { name: "LEGENDARY COMMANDO", color: "amber" };
  if (totalHours >= 500) return { name: "ELITE VANGUARD", color: "purple" };
  if (totalHours >= 100) return { name: "STEADFAST WARRIOR", color: "emerald" };
  return { name: "TACTICAL RECRUIT", color: "blue" };
};