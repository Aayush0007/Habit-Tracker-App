import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import SessionCard from "./SessionCard";
import { useStudySessions } from "../../hooks/useStudySessions";
import { calculateTotalStudyHours } from "../../features/studySessions/sessionLogic";

const StudySessions = () => {
  const { sessions, toggleSession, updateSessionTopic, loading } = useStudySessions();

  // --- PERSISTENT TIMER LOGIC START ---
  // Initialize from localStorage or default to 120 mins
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem('studyTimer_timeLeft');
    return savedTime ? parseInt(savedTime, 10) : 120 * 60;
  });
  
  const [isActive, setIsActive] = useState(() => {
    const savedActive = localStorage.getItem('studyTimer_isActive');
    return savedActive === 'true';
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('studyTimer_timeLeft', timeLeft);
    localStorage.setItem('studyTimer_isActive', isActive);
  }, [timeLeft, isActive]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
      alert("Session Complete! Take a 15-minute break.");
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(120 * 60);
    localStorage.removeItem('studyTimer_timeLeft');
    localStorage.removeItem('studyTimer_isActive');
  };
  // --- TIMER LOGIC END ---

  if (loading) return <div className="p-6 text-white text-center">Loading Sessions...</div>;

  const totalHours = calculateTotalStudyHours(sessions);

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Study Sessions</h1>
          <p className="text-slate-400">Consistency Perfection</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-emerald-400">{totalHours}h</span>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Logged Today</p>
        </div>
      </header>

      <section className="card bg-slate-900 border-slate-800 p-6 flex flex-col items-center justify-center space-y-4 shadow-xl">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Focus Timer</div>
        <div className="text-6xl font-black text-white font-mono tracking-tighter tabular-nums">
          {formatTime(timeLeft)}
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
              isActive ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-black shadow-lg shadow-emerald-900/40'
            }`}
          >
            {isActive ? <Pause size={18} /> : <Play size={18} />}
            {isActive ? 'Pause' : 'Start Focus'}
          </button>
          <button onClick={resetTimer} className="p-2 text-slate-500 hover:text-white transition-colors">
            <RotateCcw size={20} />
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session) => (
          <SessionCard 
            key={session.id} 
            session={session} 
            onToggle={toggleSession} 
            onTopicChange={updateSessionTopic}
          />
        ))}
      </div>

      {totalHours >= 8 && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 p-4 rounded-xl text-emerald-400 text-center font-medium animate-pulse">
          🎯 Target Met! Your discipline score is increasing.
        </div>
      )}
    </div>
  );
};

export default StudySessions;