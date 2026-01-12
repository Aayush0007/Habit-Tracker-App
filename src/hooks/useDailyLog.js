import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { showToast } from '../services/notificationService';

export const useDailyLog = (dateInput) => {
  const date = dateInput || new Date().toISOString().split('T')[0];
  const [log, setLog] = useState({
    workout_done: false,
    revision_done: false,
    mock_attempted: false,
    energy_level: 3
  });
  const [loading, setLoading] = useState(true);

  const fetchLog = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('id', `${user.id}-${date}`) // Direct lookup by composite ID
      .maybeSingle();

    if (data) setLog(data);
    setLoading(false);
  }, [date]);

  useEffect(() => { fetchLog(); }, [fetchLog]);

  const saveLog = async (newData) => {
    // 1. Optimistic Update (UI reacts instantly)
    setLog(prev => ({ ...prev, ...newData }));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('daily_logs')
      .upsert({
        id: `${user.id}-${date}`,
        user_id: user.id,
        date: date,
        ...newData,
        updated_at: new Date().toISOString()
      });

    if (error) {
      showToast("Cloud Sync Interrupted", "error");
      fetchLog(); // Revert to server state on error
    }
  };

  return { log, saveLog, loading };
};