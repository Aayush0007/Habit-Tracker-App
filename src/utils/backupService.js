import { supabase } from '../supabaseClient';
import { showToast } from '../services/notificationService';

export const exportUserData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user found");

    // Fetch all core tactical tables
    const [sessions, logs, mocks, syllabus] = await Promise.all([
      supabase.from('study_sessions').select('*').eq('user_id', user.id),
      supabase.from('daily_logs').select('*').eq('user_id', user.id),
      supabase.from('mock_exams').select('*').eq('user_id', user.id),
      supabase.from('syllabus_progress').select('*').eq('user_id', user.id)
    ]);

    const backup = {
      exportDate: new Date().toISOString(),
      study_sessions: sessions.data,
      daily_logs: logs.data,
      mock_exams: mocks.data,
      syllabus_progress: syllabus.data
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `warrior_cloud_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Tactical Archive Secured");
  } catch (err) {
    showToast("Export Failed", "error");
  }
};