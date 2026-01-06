import { useState, useEffect } from 'react';
import { initDB } from '../db/indexedDB/dbConfig';
import { calculateTotalStudyHours, calculateStudyStatus } from '../features/studySessions/sessionLogic';

export const useDashboardStats = (date = new Date().toISOString().split('T')[0]) => {
  const [stats, setStats] = useState({
    totalHours: 0,
    status: { label: 'Missed', color: 'text-rose-400' },
    workoutDone: false,
    revisionDone: false,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      const db = await initDB();
      
      // 1. Fetch Sessions for Study Hours
      const allSessions = await db.getAll('study_sessions');
      const todaySessions = allSessions.filter(s => s.date === date);
      const hours = calculateTotalStudyHours(todaySessions);
      
      // 2. Fetch Daily Log for Habits
      const todayLog = await db.get('daily_logs', date);

      setStats({
        totalHours: hours,
        status: calculateStudyStatus(hours * 60), // Status based on minutes
        workoutDone: (todayLog?.workoutMinutes || 0) >= 30,
        revisionDone: todayLog?.revisionDone || false,
        loading: false
      });
    };

    fetchStats();
  }, [date]);

  return stats;
};