import { initDB } from './dbConfig';
import { v4 as uuid } from 'uuid';

export const addHabit = async (habit) => {
  const db = await initDB();
  const id = uuid();
  await db.put('habits', { ...habit, id });
};

export const getHabits = async () => {
  const db = await initDB();
  return await db.getAll('habits');
};