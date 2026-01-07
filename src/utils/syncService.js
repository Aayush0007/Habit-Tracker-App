import { initDB } from '../db/indexedDB/dbConfig';

export const exportData = async () => {
  const db = await initDB();
  const stores = ['study_sessions', 'daily_logs', 'mock_exams'];
  const backup = {};

  for (const store of stores) {
    backup[store] = await db.getAll(store);
  }

  const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `warrior_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
};

export const importData = async (file) => {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = JSON.parse(e.target.result);
    const db = await initDB();
    
    for (const [storeName, items] of Object.entries(data)) {
      const tx = db.transaction(storeName, 'readwrite');
      for (const item of items) {
        await tx.store.put(item);
      }
      await tx.done;
    }
    window.location.reload();
  };
  reader.readAsText(file);
};