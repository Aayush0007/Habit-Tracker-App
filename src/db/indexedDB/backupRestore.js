import { initDB } from './dbConfig';

export const backupData = async () => {
  const db = await initDB();
  const data = {};
  for (const store of db.objectStoreNames) {
    data[store] = await db.getAll(store);
  }
  return JSON.stringify(data);
};

export const restoreData = async (jsonData) => {
  const data = JSON.parse(jsonData);
  const db = await initDB();
  const tx = db.transaction(db.objectStoreNames, 'readwrite');
  for (const store of Object.keys(data)) {
    const objectStore = tx.objectStore(store);
    for (const item of data[store]) {
      await objectStore.put(item);
    }
  }
  await tx.done;
};