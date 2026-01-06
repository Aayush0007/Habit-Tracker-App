import { openDB } from 'idb';

const DB_NAME = 'habit_tracker_db';
const VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('habits')) {
        db.createObjectStore('habits', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('study_sessions')) {
        db.createObjectStore('study_sessions', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('daily_logs')) {
        db.createObjectStore('daily_logs', { keyPath: 'date' });
      }
      if (!db.objectStoreNames.contains('mock_exams')) {
        db.createObjectStore('mock_exams', { keyPath: 'id' });
      }
    },
  });
};