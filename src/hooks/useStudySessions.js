import { useState, useEffect } from 'react';
import { initDB } from '../db/indexedDB/dbConfig';
import { generateDailySessions } from '../features/studySessions/sessionLogic';

export const useStudySessions = (date = new Date().toISOString().split('T')[0]) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from Database
  useEffect(() => {
    const loadData = async () => {
      const db = await initDB();
      const allSessions = await db.getAll('study_sessions');
      const dailySessions = allSessions.filter(s => s.date === date);

      if (dailySessions.length > 0) {
        setSessions(dailySessions.sort((a, b) => a.sessionNumber - b.sessionNumber));
      } else {
        const newSessions = generateDailySessions(date);
        setSessions(newSessions);
      }
      setLoading(false);
    };
    loadData();
  }, [date]);

  // Toggle Checkbox Logic
  const toggleSession = async (id) => {
    const updated = sessions.map(s => 
      s.id === id ? { ...s, status: s.status === 'completed' ? 'pending' : 'completed' } : s
    );
    setSessions(updated);
    saveToDB(updated.find(s => s.id === id));
  };

  // Update Topic Text Logic
  const updateSessionTopic = async (id, newTopic) => {
    const updated = sessions.map(s => 
      s.id === id ? { ...s, topic: newTopic } : s
    );
    setSessions(updated);
    saveToDB(updated.find(s => s.id === id));
  };

  // Internal Helper to save to IndexedDB
  const saveToDB = async (session) => {
    const db = await initDB();
    await db.put('study_sessions', session);
  };

  return { sessions, toggleSession, updateSessionTopic, loading };
};