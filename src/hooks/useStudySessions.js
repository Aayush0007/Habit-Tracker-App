import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { generateDailySessions } from '../features/studySessions/sessionLogic';
import { showToast } from '../services/notificationService';

export const useStudySessions = (dateInput) => {
  const date = dateInput || new Date().toISOString().split('T')[0];
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const initializationLocked = useRef(false);

  const loadData = useCallback(async () => {
    // Prevent double execution during StrictMode mount
    if (initializationLocked.current) return;
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Create 6 unique composite IDs that the TEXT field will now accept
    const templateSessions = generateDailySessions(date).map(s => ({
      ...s,
      id: `${user.id}-${date}-${s.session_number}`, 
      user_id: user.id
    }));

    // upsert will now work because 'id' is TEXT
    const { data, error } = await supabase
      .from('study_sessions')
      .upsert(templateSessions, { onConflict: 'id' }) 
      .select()
      .order('session_number', { ascending: true });

    if (error) {
      console.error("Sync Error:", error.message);
      showToast("Tactical Sync Error", "error");
    } else {
      setSessions(data);
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
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));

    const { error } = await supabase
      .from('study_sessions')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      showToast("Sync Failed", "error");
      loadData(); // Revert on error
    }
  };

  const updateSessionTopic = async (id, newTopic) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, topic: newTopic } : s));
    
    await supabase
      .from('study_sessions')
      .update({ topic: newTopic })
      .eq('id', id);
  };

  return { sessions, toggleSession, updateSessionTopic, loading };
};