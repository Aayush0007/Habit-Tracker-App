import { initDB } from './dbConfig.js';

export const saveDailyLog = async (log) => {
  const db = await initDB();
  await db.put('daily_logs', log);
};

export const getDailyLog = async (date) => {
  const db = await initDB();
  return await db.get('daily_logs', date);
};