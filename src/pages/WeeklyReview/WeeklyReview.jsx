import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, TrendingUp, ShieldCheck, Save, 
  Loader2, Zap, History, ChevronDown, Calendar, ArrowRight 
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { showToast } from '../../services/notificationService';

const WeeklyReview = () => {
  const [weeklyAvg, setWeeklyAvg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [reflection, setReflection] = useState({ workedWell: '', improvements: '' });

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const fetchWeeklyData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Calculate stats for the current active week
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateStr = sevenDaysAgo.toISOString().split('T')[0];

    const { data: sessions } = await supabase
      .from('study_sessions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .gte('date', dateStr);

    const totalHours = (sessions?.length || 0) * 2;
    setWeeklyAvg((totalHours / 7).toFixed(1));

    // 2. Fetch History of past reflections
    const { data: reviews, error } = await supabase
      .from('weekly_reviews')
      .select('*')
      .eq('user_id', user.id)
      .order('week_start_date', { ascending: false });

    if (!error) setHistory(reviews || []);
    setLoading(false);
  };

  const handleLockReview = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // OPTIMIZED WEEK CALCULATION
      // Find the most recent Monday to act as the week_start_date
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
      const monday = new Date(now.setDate(diff));
      const weekStartDate = monday.toISOString().split('T')[0];
      
      // UNIQUE WEEK ID: USERID-YYYY-MM-DD (Start of week)
      const weekId = `${user.id}-${weekStartDate}`;

      const { error } = await supabase
        .from('weekly_reviews')
        .upsert({
          id: weekId,
          user_id: user.id,
          week_start_date: weekStartDate,
          worked_well: reflection.workedWell,
          improvements: reflection.improvements,
          avg_hours: parseFloat(weeklyAvg),
          discipline_score: Math.round((parseFloat(weeklyAvg) / 12) * 100)
        });

      if (error) throw error;

      showToast("Tactical Strategy Archived");
      fetchWeeklyData();
      // Clear current reflection inputs after save
      setReflection({ workedWell: '', improvements: '' });
      
    } catch (error) {
      console.error("Save Error:", error);
      showToast(error.message || "Cloud Sync Error", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
      <Loader2 className="text-emerald-500 animate-spin mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Compiling Intelligence...</p>
    </div>
  );

  return (
    <div className="p-6 space-y-10 pb-32 max-w-2xl mx-auto">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="text-emerald-500" size={24} />
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">After Action Report</h1>
        </div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">Strategy • Reflection • Archive</p>
      </header>

      {/* Stats Summary */}
      <div className="card bg-slate-900 border-2 border-emerald-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Weekly Performance Mean</p>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-black text-white italic">{weeklyAvg}</span>
          <span className="text-slate-500 font-bold text-sm uppercase italic">Hours / Day</span>
        </div>
        <TrendingUp className="absolute -right-4 -bottom-4 text-emerald-500 opacity-10 rotate-12" size={140} />
      </div>

      {/* Input Section */}
      <div className="card bg-slate-900 border-2 border-slate-800 p-7 rounded-[2rem] space-y-6 shadow-xl">
        <div className="flex items-center gap-3 text-blue-400 border-b border-slate-800 pb-4">
          <ClipboardCheck size={20} />
          <h2 className="font-black uppercase italic tracking-widest text-sm">Sunday Ritual</h2>
        </div>
        
        <div className="space-y-6">
          <textarea 
            className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700" 
            rows="3" placeholder="Force Multipliers (What worked?)"
            value={reflection.workedWell}
            onChange={(e) => setReflection({...reflection, workedWell: e.target.value})}
          />
          <textarea 
            className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-sm text-slate-200 outline-none focus:border-blue-500 transition-all placeholder:text-slate-700" 
            rows="3" placeholder="Critical Deficiencies (Improvements?)"
            value={reflection.improvements}
            onChange={(e) => setReflection({...reflection, improvements: e.target.value})}
          />
          <button 
            onClick={handleLockReview}
            disabled={saving}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl font-black uppercase tracking-[0.3em] transition-all shadow-xl flex items-center justify-center gap-4 text-xs disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Syncing...' : 'Lock Strategy'}
          </button>
        </div>
      </div>

      {/* --- HISTORY SECTION --- */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 ml-2">
          <History size={18} className="text-slate-500" />
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Reflective Archive</h3>
        </div>

        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="p-10 border-2 border-dashed border-slate-800 rounded-[2rem] text-center opacity-40">
              <p className="text-[10px] font-bold uppercase text-slate-500">No Archive Data Secured</p>
            </div>
          ) : (
            history.map((rev) => (
              <div key={rev.id} className="card bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] space-y-4 hover:border-slate-700 transition-all">
                <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                      Week Starting: {new Date(rev.week_start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg">
                    <span className="text-[10px] font-black text-emerald-400">{rev.avg_hours}h</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase">Avg</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Victory</p>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">{rev.worked_well || 'No victory logged'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Correction</p>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">{rev.improvements || 'No correction logged'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default WeeklyReview;