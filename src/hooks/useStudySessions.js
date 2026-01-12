import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { generateDailySessions } from '../features/studySessions/sessionLogic';
import { showToast } from '../services/notificationService';

export const useStudySessions = (dateInput) => {
  const date = dateInput || new Date().toISOString().split('T')[0];
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. FIRST: Try to fetch existing sessions for today
    const { data: existingData, error: fetchError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .order('session_number', { ascending: true });

    // 2. IF NO DATA EXISTS: Only then generate and save the template
    if (!existingData || existingData.length === 0) {
      const templateSessions = generateDailySessions(date, user.id).map(s => ({
        ...s,
        id: `${user.id}-${date}-${s.session_number}`, 
      }));

      const { data: newData, error: upsertError } = await supabase
        .from('study_sessions')
        .upsert(templateSessions)
        .select();

      if (!upsertError) setSessions(newData);
    } else {
      // 3. IF DATA EXISTS: Simply use what's in the database
      setSessions(existingData);
    }
    
    setLoading(false);
  }, [date]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleSession = async (id) => {
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    
    const newStatus = session.status === 'completed' ? 'pending' : 'completed';
    
    // Optimistic Update
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));

    const { error } = await supabase
      .from('study_sessions')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      showToast("Sync Failed", "error");
      loadData(); // Revert
    }
  };

  const updateSessionTopic = async (id, newTopic) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, topic: newTopic } : s));
    
    const { error } = await supabase
      .from('study_sessions')
      .update({ topic: newTopic })
      .eq('id', id);
      
    if (error) showToast("Topic Sync Error", "error");
  };

  return { sessions, toggleSession, updateSessionTopic, loading };
};