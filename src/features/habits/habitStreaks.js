export const updateStreak = (currentStreak, wasDone) => {
  return wasDone ? currentStreak + 1 : 0;
};