import { useState, useEffect } from 'react';
import { initDB } from '../db/indexedDB/dbConfig';

export const useSyllabus = () => {
  const [completedTopics, setCompletedTopics] = useState([]);

  useEffect(() => {
    const loadSyllabus = async () => {
      const db = await initDB();
      const saved = await db.getAll('syllabus_progress');
      setCompletedTopics(saved.map(item => item.topicName));
    };
    loadSyllabus();
  }, []);

  const toggleTopic = async (topicName) => {
    const db = await initDB();
    if (completedTopics.includes(topicName)) {
      await db.delete('syllabus_progress', topicName);
      setCompletedTopics(prev => prev.filter(t => t !== topicName));
    } else {
      await db.add('syllabus_progress', { topicName, dateCompleted: new Date().toISOString() });
      setCompletedTopics(prev => [...prev, topicName]);
    }
  };

  return { completedTopics, toggleTopic };
};