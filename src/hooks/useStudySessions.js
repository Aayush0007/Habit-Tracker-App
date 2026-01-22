import { useState, useEffect, useCallback, useMemo } from 'react'; // Added useMemo
import { supabase } from '../supabaseClient';
import { generateDailySessions } from '../features/studySessions/sessionLogic';
import { showToast } from '../services/notificationService';

export const useStudySessions = (dateInput) => {
  // FORCE IST DATE STRING: This ensures we fetch Jan 23 data when it is Jan 23 in India
  const date = useMemo(() => {
    if (dateInput) return dateInput;
    
    return new Intl.DateTimeFormat('en-CA', { 
      timeZone: 'Asia/Kolkata', 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).format(new Date());
  }, [dateInput]);

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch existing sessions for the IST date
    const { data: existingData } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .order('session_number', { ascending: true });

    if (!existingData || existingData.length === 0) {
      // Generate fresh sessions for the NEW day
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
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    const { error } = await supabase.from('study_sessions').update({ status: newStatus }).eq('id', id);
    if (error) { showToast("Sync Failed", "error"); loadData(); }
  };

  const updateSessionTopic = async (id, newTopic) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, topic: newTopic } : s));
    const { error } = await supabase.from('study_sessions').update({ topic: newTopic }).eq('id', id);
    if (error) showToast("Topic Sync Error", "error");
  };

  return { sessions, toggleSession, updateSessionTopic, loading };
};