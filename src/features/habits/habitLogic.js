export const calculateHabitStatus = (habit, loggedValue) => {
  if (habit.type === 'binary') return loggedValue ? 'done' : 'missed';
  return loggedValue >= habit.dailyTargetMin ? 'done' : 'missed';
};