export const toggleRecoveryDay = async (date, currentStatus) => {
  const db = await initDB();
  const log = await db.get('daily_logs', date) || { date };
  
  const updatedLog = {
    ...log,
    isRecoveryDay: !log.isRecoveryDay,
    dayStatus: !log.isRecoveryDay ? 'recovery' : 'missed'
  };
  
  await db.put('daily_logs', updatedLog);
  return updatedLog;
};