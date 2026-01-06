// Logic: Consistency (80%) + Energy Management (20%)
export const calculateDisciplineScore = (logs) => {
  if (!logs || logs.length === 0) return 0;

  const totalDays = logs.length;
  const targetMetDays = logs.filter(log => log.dayStatus === 'target' || log.dayStatus === 'best').length;
  
  // Consistency Ratio
  const consistency = (targetMetDays / totalDays) * 100;
  
  // Discipline Score out of 100
  return Math.round(consistency);
};

export const getIdentityLevel = (totalHours) => {
  if (totalHours > 1000) return "Elite Aspirant";
  if (totalHours > 500) return "Dedicated Warrior";
  if (totalHours > 100) return "Consistent Performer";
  return "Rising Candidate";
};