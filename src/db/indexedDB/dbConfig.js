import { openDB } from 'idb';

const DB_NAME = 'habit_tracker_db';
// INCREMENTED VERSION: Changed from 1 to 2 to trigger the upgrade
const VERSION = 2; 

export const initDB = async () => {
  return openDB(DB_NAME, VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // 1. Core Habits Store
      if (!db.objectStoreNames.contains('habits')) {
        db.createObjectStore('habits', { keyPath: 'id' });
      }
      
      // 2. Study Sessions (2-hour blocks)
      if (!db.objectStoreNames.contains('study_sessions')) {
        db.createObjectStore('study_sessions', { keyPath: 'id' });
      }
      
      // 3. Daily Logs (Calendar & Status)
      if (!db.objectStoreNames.contains('daily_logs')) {
        db.createObjectStore('daily_logs', { keyPath: 'date' });
      }
      
      // 4. Mock Exams (Scores & Difficulty)
      if (!db.objectStoreNames.contains('mock_exams')) {
        db.createObjectStore('mock_exams', { keyPath: 'id' });
      }
      
      // 5. Syllabus Progress (Mastery tracking)
      if (!db.objectStoreNames.contains('syllabus_progress')) {
        db.createObjectStore('syllabus_progress', { keyPath: 'topicName' });
      }
    },
  });
};