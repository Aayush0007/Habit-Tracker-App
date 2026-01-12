import React, { useState, useEffect } from 'react';
import { useDailyLog } from '../../hooks/useDailyLog';
import { Zap, Target, Save, Activity, BatteryMedium } from 'lucide-react';

const DailyTracker = () => {
  const { log, saveLog, loading } = useDailyLog();
  const [localHabits, setLocalHabits] = useState(null);

  useEffect(() => {
    if (log) setLocalHabits(log);
  }, [log]);

  if (loading || !localHabits) {
    return (
      <div className="p-6 text-white text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full mb-6" />
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Command Logs...</p>
      </div>
    );
  }

  const updateField = (field, value) => {
    setLocalHabits(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-8 pb-24 max-w-lg mx-auto">
      <header>
        <h1 className="text-4xl font-black italic tracking-tighter leading-none text-white">DAILY ACCOUNTABILITY</h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Non-negotiable 2026 Standards</p>
      </header>

      <div className="space-y-5">
        {/* Workout Card */}
        <div className="group relative overflow-hidden card bg-slate-900 border-slate-800 p-6 flex justify-between items-center rounded-3xl border-2 transition-all hover:border-emerald-500/30">
          <div className="flex items-center gap-5 relative z-10">
            <div className={`p-4 rounded-2xl transition-all duration-500 ${localHabits.workout_done ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40' : 'bg-slate-800 text-slate-500'}`}>
              <Activity size={28} />
            </div>
            <div>
              <h3 className="font-black text-white uppercase tracking-tighter text-lg">Physical Training</h3>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">Conditioning Status</p>
            </div>
          </div>
          <button 
            onClick={() => updateField('workout_done', !localHabits.workout_done)}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all ${localHabits.workout_done ? 'bg-emerald-500 text-white shadow-xl' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
          >
            {localHabits.workout_done ? 'MISSION DONE' : 'INITIALIZE'}
          </button>
        </div>

        {/* Toggles Row */}
        <div className="grid grid-cols-2 gap-4">
          <HabitToggle 
            label="Revision" 
            isActive={localHabits.revision_done} 
            icon={<Zap size={22} />} 
            onClick={() => updateField('revision_done', !localHabits.revision_done)}
            activeColor="border-blue-500/50 bg-blue-500/5 text-blue-400"
          />
          <HabitToggle 
            label="Mock Attempt" 
            isActive={localHabits.mock_attempted} 
            icon={<Target size={22} />} 
            onClick={() => updateField('mock_attempted', !localHabits.mock_attempted)}
            activeColor="border-amber-500/50 bg-amber-500/5 text-amber-400"
          />
        </div>

        {/* Energy Slider */}
        <div className="card bg-slate-900 border-slate-800 p-7 rounded-3xl border-2 space-y-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-500">
               <BatteryMedium size={16} />
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Biological Energy</h3>
            </div>
            <span className="text-2xl font-black text-emerald-400 italic tabular-nums">{localHabits.energy_level}/5</span>
          </div>
          <input 
            type="range" min="1" max="5" 
            className="w-full h-3 bg-slate-950 rounded-full appearance-none cursor-pointer accent-emerald-500 border border-slate-800 shadow-inner"
            value={localHabits.energy_level || 3}
            onChange={(e) => updateField('energy_level', parseInt(e.target.value))}
          />
          <div className="flex justify-between px-1">
             <span className="text-[8px] font-bold text-slate-700 uppercase">Low</span>
             <span className="text-[8px] font-bold text-slate-700 uppercase">Max Performance</span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => saveLog(localHabits)}
        className="group relative w-full overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] transition-all shadow-2xl shadow-emerald-900/40 flex items-center justify-center gap-4 text-xs"
      >
        <Save size={20} className="group-hover:scale-110 transition-transform" />
        Sync Tactical Log
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>
    </div>
  );
};

const HabitToggle = ({ label, isActive, icon, onClick, activeColor }) => (
  <button 
    onClick={onClick}
    className={`card p-6 flex flex-col items-center gap-4 rounded-3xl border-2 transition-all duration-500 ${isActive ? activeColor : 'border-slate-800 bg-slate-900 opacity-40 hover:opacity-70'}`}
  >
    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
      {icon}
    </div>
    <div className="text-center">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] block mb-1">{label}</span>
      <span className="text-[10px] font-bold opacity-80">{isActive ? 'MISSION DONE' : 'PENDING'}</span>
    </div>
  </button>
);

export default DailyTracker;