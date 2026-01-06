import React, { useState, useEffect } from 'react';
import { ClipboardCheck, TrendingUp } from 'lucide-react';
import { initDB } from '../../db/indexedDB/dbConfig';

const WeeklyReview = () => {
  // 1. PLACE LOGIC HERE (Inside the component, before return)
  const [weeklyAvg, setWeeklyAvg] = useState(0);

  useEffect(() => {
    const calculateWeeklyAvg = async () => {
      const db = await initDB();
      const allLogs = await db.getAll('daily_logs');
      
      // Filter for only the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const lastSevenDays = allLogs.filter(log => new Date(log.date) >= sevenDaysAgo);
      
      const totalMinutes = lastSevenDays.reduce((acc, curr) => acc + (curr.studyMinutes || 0), 0);
      
      // Convert to average hours per day
      const avgHours = (totalMinutes / 7 / 60).toFixed(1);
      setWeeklyAvg(avgHours);
    };
    calculateWeeklyAvg();
  }, []);

  return (
    <div className="p-6 space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-white">Weekly Reflection</h1>
        <p className="text-slate-400 text-sm">Convert effort into strategy</p>
      </header>

      {/* 2. UI UPDATE: Weekly Average Card */}
      <div className="card bg-emerald-500/10 border-emerald-500/20 p-6 flex items-center justify-between shadow-lg shadow-emerald-900/10">
        <div>
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Weekly Average</p>
          <p className="text-4xl font-black text-white">{weeklyAvg} <span className="text-sm font-normal text-slate-400 italic">hrs/day</span></p>
        </div>
        <div className="bg-emerald-500/20 p-3 rounded-full">
          <TrendingUp className="text-emerald-400" size={24} />
        </div>
      </div>

      <div className="card border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="flex items-center gap-3 text-emerald-400 mb-2">
          <ClipboardCheck size={20} />
          <h2 className="font-bold">Sunday Ritual</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">What worked well this week?</label>
            <textarea 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 mt-2 text-sm text-white outline-none focus:border-emerald-500 transition-all" 
              rows="3" 
              placeholder="e.g. Early morning quants sessions were productive..."
            ></textarea>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">One improvement for next week?</label>
            <textarea 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 mt-2 text-sm text-white outline-none focus:border-blue-500 transition-all" 
              rows="3" 
              placeholder="e.g. Need to improve mock analysis speed..."
            ></textarea>
          </div>
          <button className="btn-primary w-full py-4 font-bold shadow-lg shadow-emerald-900/20">
            Lock Weekly Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReview;