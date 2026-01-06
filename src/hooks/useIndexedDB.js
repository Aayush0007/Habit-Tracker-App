import { useEffect, useState } from 'react';
import { initDB } from '../db/indexedDB/dbConfig';

export const useIndexedDB = () => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    initDB().then(setDb);
  }, []);

  return db;
};