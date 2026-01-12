import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { showToast } from '../services/notificationService';

export const useMocks = () => {
  const [mocks, setMocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMocks = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('mock_exams')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) showToast(error.message, 'error');
    else setMocks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMocks();
  }, [fetchMocks]);

  const createMock = async (mockData) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('mock_exams')
      .insert([{ ...mockData, user_id: user.id }]);

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast("Mock Analysis Captured");
      fetchMocks();
    }
  };

  const deleteMock = async (id) => {
    const { error } = await supabase
      .from('mock_exams')
      .delete()
      .eq('id', id);

    if (error) showToast(error.message, 'error');
    else {
      setMocks(prev => prev.filter(m => m.id !== id));
      showToast("Record Purged");
    }
  };

  return { mocks, createMock, deleteMock, loading };
};