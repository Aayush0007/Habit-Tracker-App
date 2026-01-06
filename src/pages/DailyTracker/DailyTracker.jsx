import React, { useState, useEffect } from 'react';
import { useDailyLog } from '../../hooks/useDailyLog';

const DailyTracker = () => {
  const { log, saveLog, loading } = useDailyLog();
  const [localHabits, setLocalHabits] = useState(null);

  // 1. Sync local state with database state when it loads
  useEffect(() => {
    if (log) setLocalHabits(log);
  }, [log]);

  if (loading || !localHabits) {
    return <div className="p-6 text-white">Accessing Database...</div>;
  }

  // 2. Handler to update local state immediately as you type/click
  const updateField = (field, value) => {
    setLocalHabits(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold">Daily Accountability</h1>
        <p className="text-slate-400">Non-negotiable habits for 2026.</p>
      </header>

      <div className="space-y-4">
        {/* Workout - Numeric Input */}
        <div className="card flex justify-between items-center">
          <div>
            <h3 className="font-bold">Workout / Training</h3>
            <p className="text-xs text-slate-400">Minutes exercised</p>
          </div>
          <input 
            type="number" 
            className="w-20 bg-slate-900 border border-slate-700 p-2 rounded text-center text-emerald-400 font-bold"
            value={localHabits.workoutMinutes || 0}
            onChange={(e) => updateField('workoutMinutes', parseInt(e.target.value) || 0)}
          />
        </div>

        {/* Revision & Mock - Binary Toggles */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => updateField('revisionDone', !localHabits.revisionDone)}
            className={`card flex flex-col items-center gap-2 transition-all ${
              localHabits.revisionDone ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700'
            }`}
          >
            <span className="text-sm font-bold">Revision</span>
            <span className={localHabits.revisionDone ? 'text-emerald-400' : 'text-slate-500'}>
              {localHabits.revisionDone ? '✅ Done' : '⭕ Pending'}
            </span>
          </button>

          <button 
            onClick={() => updateField('mockAttempted', !localHabits.mockAttempted)}
            className={`card flex flex-col items-center gap-2 transition-all ${
              localHabits.mockAttempted ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'
            }`}
          >
            <span className="text-sm font-bold">Mock Test</span>
            <span className={localHabits.mockAttempted ? 'text-blue-400' : 'text-slate-500'}>
              {localHabits.mockAttempted ? '✅ Attempted' : '⭕ Pending'}
            </span>
          </button>
        </div>

        {/* Energy Level Slider */}
        <div className="card space-y-3">
          <div className="flex justify-between">
            <h3 className="font-bold">Energy Level</h3>
            <span className="text-emerald-400 font-bold">{localHabits.energyLevel}/5</span>
          </div>
          <input 
            type="range" min="1" max="5" 
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            value={localHabits.energyLevel || 3}
            onChange={(e) => updateField('energyLevel', parseInt(e.target.value))}
          />
        </div>
      </div>

      {/* 3. Save Button - Pushes local state back to IndexedDB */}
      <button 
        onClick={() => saveLog(localHabits)}
        className="btn-primary w-full py-4 shadow-emerald-900/20 shadow-xl"
      >
        Save Daily Log
      </button>
    </div>
  );
};

export default DailyTracker;