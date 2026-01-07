import { useState, useEffect } from 'react';
import { initDB } from '../db/indexedDB/dbConfig';
import { calculateTotalStudyHours, calculateStudyStatus } from '../features/studySessions/sessionLogic';
import { SYLLABUS } from '../data/syllabus'; // FIXED: Changed from SYLLABUS_DATA to SYLLABUS

export const useDashboardStats = (date = new Date().toISOString().split('T')[0]) => {
  const [stats, setStats] = useState({
    totalHours: 0,
    status: { label: 'Missed', color: 'text-rose-400' },
    workoutDone: false,
    revisionDone: false,
    readiness: 0,
    mockAvg: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const db = await initDB();
        
        // 1. Study Hours logic
        const allSessions = await db.getAll('study_sessions');
        const todaySessions = allSessions.filter(s => s.date === date);
        const hours = calculateTotalStudyHours(todaySessions);
        
        // 2. Habits logic
        const todayLog = await db.get('daily_logs', date);

        // 3. Syllabus Readiness logic
        const completedSyllabus = await db.getAll('syllabus_progress');
        const totalTopics = Object.values(SYLLABUS).flat().length;
        const syllabusPercent = totalTopics > 0 ? (completedSyllabus.length / totalTopics) * 100 : 0;

        // 4. Mock Average logic
        const allMocks = await db.getAll('mock_exams');
        const avgMockScore = allMocks.length > 0 
          ? allMocks.reduce((sum, m) => sum + Number(m.score), 0) / allMocks.length 
          : 0;

        // Weighted Readiness: 60% Syllabus Coverage + 40% Mock Avg
        const readinessScore = (syllabusPercent * 0.6) + (avgMockScore * 0.4);

        setStats({
          totalHours: hours,
          status: calculateStudyStatus(hours * 60),
          workoutDone: (todayLog?.workoutMinutes || 0) >= 30,
          revisionDone: todayLog?.revisionDone || false,
          readiness: Math.round(readinessScore),
          mockAvg: Math.round(avgMockScore),
          loading: false
        });
      } catch (error) {
        console.error("Dashboard Stats Error:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [date]);

  return stats;
};