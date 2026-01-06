import { useState, useEffect } from 'react';
import { initDB } from '../db/indexedDB/dbConfig';

export const useDailyLog = (date = new Date().toISOString().split('T')[0]) => {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLog = async () => {
      const db = await initDB();
      const existingLog = await db.get('daily_logs', date);
      
      if (existingLog) {
        setLog(existingLog);
      } else {
        // Default empty log for a new day
        setLog({
          date,
          studyMinutes: 0,
          workoutMinutes: 0,
          revisionDone: false,
          mockAttempted: false,
          sleepHours: 7,
          energyLevel: 3,
          dayStatus: 'missed'
        });
      }
      setLoading(false);
    };
    fetchLog();
  }, [date]);

  const saveLog = async (updatedData) => {
    const db = await initDB();
    await db.put('daily_logs', { ...log, ...updatedData });
    setLog({ ...log, ...updatedData });
    alert("Progress Saved for 2026 Goal!"); 
  };

  return { log, saveLog, loading };
};