import { useState, useEffect } from 'react';
import { initDB } from '../db/indexedDB/dbConfig';
import { calculateTotalStudyHours, calculateStudyStatus } from '../features/studySessions/sessionLogic';
import { SYLLABUS } from '../data/syllabus';

export const useDashboardStats = (activeExam = 'SBI PO Pre', date = new Date().toISOString().split('T')[0]) => {
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
        
        // 1. Study Hours (Daily)
        const allSessions = await db.getAll('study_sessions');
        const todaySessions = allSessions.filter(s => s.date === date);
        const hours = calculateTotalStudyHours(todaySessions);
        
        // 2. Habits (Daily)
        const todayLog = await db.get('daily_logs', date);

        // 3. Exam-Specific Syllabus Readiness
        const completedSyllabus = await db.getAll('syllabus_progress');
        
        // Define which categories apply to which exam type
        let relevantCategories = ["Banking Core (Quants/Reason/Eng)"];
        if (activeExam.includes('SSC') || activeExam.includes('AFCAT') || activeExam.includes('NTPC')) {
          relevantCategories.push("SSC & AFCAT (Advance/GS)");
        }
        if (activeExam.includes('RBI') || activeExam.includes('SEBI') || activeExam.includes('NABARD')) {
          relevantCategories.push("Regulatory (RBI/SEBI/NABARD)");
        }
        if (activeExam.includes('Comp')) {
          relevantCategories.push("Computer & Technical");
        }

        const relevantTopics = Object.entries(SYLLABUS)
          .filter(([category]) => relevantCategories.includes(category))
          .flatMap(([_, topics]) => topics);

        const completedCount = completedSyllabus.filter(item => 
          relevantTopics.includes(item.topicName)
        ).length;

        const syllabusPercent = relevantTopics.length > 0 ? (completedCount / relevantTopics.length) * 100 : 0;

        // 4. Exam-Specific Mock Average
        const allMocks = await db.getAll('mock_exams');
        const examSpecificMocks = allMocks.filter(m => m.category === activeExam);
        const avgMockScore = examSpecificMocks.length > 0 
          ? examSpecificMocks.reduce((sum, m) => sum + Number(m.score), 0) / examSpecificMocks.length 
          : 0;

        // Weighted Readiness: 60% Syllabus + 40% Mock Performance
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
  }, [date, activeExam]); // Re-calculate when the exam target changes

  return stats;
};