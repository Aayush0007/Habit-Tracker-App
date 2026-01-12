import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { calculateStudyStatus } from '../features/studySessions/sessionLogic';
import { SYLLABUS } from '../data/syllabus';

export const useDashboardStats = (activeExam = 'AFCAT', date = new Date().toISOString().split('T')[0]) => {
  const [stats, setStats] = useState({
    totalHours: 0,
    status: { label: 'Inactive', color: 'text-slate-500' },
    workoutDone: false,
    revisionDone: false,
    readiness: 0,
    mockAvg: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Simultaneous Fetch for "Warrior" speed
        const [sessionsRes, logsRes, progressRes, mocksRes] = await Promise.all([
          supabase.from('study_sessions').select('status').eq('user_id', user.id).eq('date', date).eq('status', 'completed'),
          supabase.from('daily_logs').select('workout_done, revision_done').eq('id', `${user.id}-${date}`).maybeSingle(),
          supabase.from('syllabus_progress').select('topic_name').eq('user_id', user.id),
          supabase.from('mock_exams').select('score').eq('user_id', user.id).eq('category', activeExam)
        ]);

        const hours = (sessionsRes.data?.length || 0) * 2;
        const todayLog = logsRes.data || { workout_done: false, revision_done: false };
        const completedTopics = progressRes.data?.map(p => p.topic_name) || [];

        // Dynamic Syllabus Calculation
        const examKeywords = activeExam.split(' ')[0]; // Gets "SBI", "AFCAT", etc.
        const relevantTopics = Object.entries(SYLLABUS)
          .filter(([category]) => category.includes(examKeywords) || category.includes("Banking Core"))
          .flatMap(([_, topics]) => topics);

        const syllabusPercent = relevantTopics.length > 0 
          ? (completedTopics.filter(t => relevantTopics.includes(t)).length / relevantTopics.length) * 100 
          : 0;

        const avgMock = mocksRes.data?.length > 0 
          ? mocksRes.data.reduce((s, m) => s + m.score, 0) / mocksRes.data.length 
          : 0;

        setStats({
          totalHours: hours,
          status: calculateStudyStatus(hours),
          workoutDone: todayLog.workout_done,
          revisionDone: todayLog.revision_done,
          readiness: Math.round((syllabusPercent * 0.7) + (avgMock * 0.3)), // Syllabus is weighted higher
          mockAvg: Math.round(avgMock),
          loading: false
        });
      } catch (e) {
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchStats();
  }, [date, activeExam]);

  return stats;
};