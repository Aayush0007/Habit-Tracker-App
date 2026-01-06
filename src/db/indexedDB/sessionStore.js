import { initDB } from './dbConfig.js';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const TODAY = format(new Date(), 'yyyy-MM-dd');

export const addSession = async (session) => {
  const db = await initDB();
  const id = uuidv4();
  await db.put('study_sessions', { ...session, id });
};

export const getSessionsForToday = async () => {
  const db = await initDB();
  const all = await db.getAll('study_sessions');
  return all.filter(s => s.date === TODAY);
};

export const updateSession = async (session) => {
  const db = await initDB();
  await db.put('study_sessions', session);
};