import { initDB } from '../db/indexedDB/dbConfig';

export const exportUserData = async () => {
  const db = await initDB();
  // Included all 5 stores to ensure full 2026 data backup
  const stores = ['study_sessions', 'daily_logs', 'mock_exams', 'habits', 'syllabus_progress'];
  const backup = {};

  for (const store of stores) {
    backup[store] = await db.getAll(store);
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `warrior_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importUserData = async (file) => {
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      const db = await initDB();
      
      for (const [storeName, items] of Object.entries(data)) {
        if (db.objectStoreNames.contains(storeName)) {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          
          for (const item of items) {
            await store.put(item);
          }
          await tx.done;
        }
      }
      alert("Backup restored successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Import failed:", err);
      alert("Failed to import backup. Ensure the file is a valid .json backup.");
    }
  };
  reader.readAsText(file);
};