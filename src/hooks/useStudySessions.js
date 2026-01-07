import { useState, useEffect, useCallback } from 'react';
import { initDB } from '../db/indexedDB/dbConfig';
import { generateDailySessions } from '../features/studySessions/sessionLogic';

export const useStudySessions = (dateInput) => {
  const date = dateInput || new Date().toISOString().split('T')[0];
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const db = await initDB();
    
    // Fetch and filter for the specific date
    const allSessions = await db.getAll('study_sessions');
    const dailySessions = allSessions
      .filter(s => s.date === date)
      .sort((a, b) => a.sessionNumber - b.sessionNumber);

    if (dailySessions.length > 0) {
      // If sessions exist, load them
      setSessions(dailySessions);
    } else {
      // CRITICAL FIX: Generate AND Save immediately to DB
      const newSessions = generateDailySessions(date);
      
      const tx = db.transaction('study_sessions', 'readwrite');
      await Promise.all([
        ...newSessions.map(s => tx.store.put(s)),
        tx.done
      ]);
      
      setSessions(newSessions);
    }
    setLoading(false);
  }, [date]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Existing toggle and update logic...
  const toggleSession = async (id) => {
    const updated = sessions.map(s => {
      if (s.id === id) {
        const newItem = { ...s, status: s.status === 'completed' ? 'pending' : 'completed' };
        saveToDB(newItem);
        return newItem;
      }
      return s;
    });
    setSessions(updated);
  };

  const updateSessionTopic = async (id, newTopic) => {
    const updated = sessions.map(s => {
      if (s.id === id) {
        const newItem = { ...s, topic: newTopic };
        saveToDB(newItem);
        return newItem;
      }
      return s;
    });
    setSessions(updated);
  };

  const saveToDB = async (session) => {
    const db = await initDB();
    await db.put('study_sessions', session);
  };

  return { sessions, toggleSession, updateSessionTopic, loading };
};