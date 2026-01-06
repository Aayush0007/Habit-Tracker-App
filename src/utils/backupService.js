import { initDB } from '../db/indexedDB/dbConfig';

export const exportUserData = async () => {
  const db = await initDB();
  const stores = ['study_sessions', 'daily_logs', 'mock_exams'];
  const backup = {};

  for (const store of stores) {
    backup[store] = await db.getAll(store);
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `aspirant_2026_backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};