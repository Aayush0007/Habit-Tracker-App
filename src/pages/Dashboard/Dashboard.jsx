import React from 'react';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { Trophy, Flame, Zap, Target, BarChart3 } from 'lucide-react'; 
import CountdownHeader from '../../components/Dashboard/CountdownHeader';

const Dashboard = () => {
  // Destructure the new readiness and mockAvg values
  const { totalHours, status, workoutDone, revisionDone, readiness, mockAvg, loading } = useDashboardStats();

  if (loading) return <div className="p-6 text-white text-center">Loading Command Center...</div>;

  const progressPercent = (totalHours / 12) * 100;

  return (
    <div className="p-6 space-y-6 pb-24">
      <CountdownHeader />
      
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter">WARRIOR MODE</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Focus: SBI PO 2026</p>
        </div>
        <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
          <Flame className="text-orange-500" fill="currentColor" size={24} />
        </div>
      </header>

      {/* Main Study Progress */}
      <section className="card bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-5xl font-black text-white">{totalHours}</span>
            <span className="text-slate-500 font-bold ml-2">/ 12 HRS</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${status.color.replace('text', 'border').replace('400', '500/50')} bg-slate-900`}>
            {status.label}
          </div>
        </div>
        
        <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" 
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </section>

      {/* NEW: Exam Readiness Section */}
      <section className="card bg-slate-900 border-slate-800 p-5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-400" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Exam Readiness</h3>
          </div>
          <span className="text-xl font-black text-blue-400">{readiness}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)] transition-all duration-1000" 
            style={{ width: `${readiness}%` }} 
          />
        </div>
        <div className="flex justify-between mt-3">
           <p className="text-[10px] text-slate-500">Mock Avg: <span className="text-slate-300">{mockAvg}</span></p>
           <p className="text-[10px] text-slate-500 italic">*Based on syllabus & mocks</p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className={`card flex flex-col items-center justify-center p-4 gap-2 border-2 transition-all ${workoutDone ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 opacity-50'}`}>
          <Zap size={20} className={workoutDone ? 'text-emerald-400' : 'text-slate-600'} />
          <span className="text-[10px] font-black uppercase text-slate-400">Workout</span>
        </div>
        <div className={`card flex flex-col items-center justify-center p-4 gap-2 border-2 transition-all ${revisionDone ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 opacity-50'}`}>
          <Target size={20} className={revisionDone ? 'text-blue-400' : 'text-slate-600'} />
          <span className="text-[10px] font-black uppercase text-slate-400">Revision</span>
        </div>
      </div>

      <div className="card bg-slate-900 border-dashed border-slate-700">
        <div className="flex gap-3 items-center">
          <div className="bg-amber-500/20 p-2 rounded-full">
            <Trophy className="text-amber-500" size={18} />
          </div>
          <p className="text-xs text-slate-300">
            {readiness < 50 
              ? "Focus on Syllabus coverage to increase readiness." 
              : "Ready for battle. Keep practicing mocks."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;