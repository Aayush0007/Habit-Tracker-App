import React from 'react';
import { Shield, Trophy, Zap, Star, ChevronRight } from 'lucide-react';
import { CONFIG } from '../config';

const IdentityHeader = ({ totalHours = 0 }) => {
  // Mapping icons to rank names for the dynamic UI
  const iconMap = {
    "TACTICAL RECRUIT": Zap,
    "STEADFAST WARRIOR": Shield,
    "ELITE VANGUARD": Trophy,
    "LEGENDARY COMMANDO": Star
  };

  // Logic: Find the highest rank achieved based on totalHours
  const currentRank = [...CONFIG.RANKS]
    .reverse()
    .find(r => totalHours >= r.minHours) || CONFIG.RANKS[0];
  
  const nextRankIndex = CONFIG.RANKS.findIndex(r => r.name === currentRank.name) + 1;
  const nextRank = CONFIG.RANKS[nextRankIndex];
  
  // Progress calculation for the tactical bar
  const progressToNext = nextRank 
    ? ((totalHours - currentRank.minHours) / (nextRank.minHours - currentRank.minHours)) * 100 
    : 100;

  const colorClasses = {
    blue: "border-blue-500/30 text-blue-500 bg-blue-500 shadow-blue-500/10",
    emerald: "border-emerald-500/30 text-emerald-500 bg-emerald-500 shadow-emerald-500/10",
    purple: "border-purple-500/30 text-purple-500 bg-purple-500 shadow-purple-500/10",
    amber: "border-amber-500/30 text-amber-500 bg-amber-500 shadow-amber-500/10"
  };

  const Icon = iconMap[currentRank.name] || Zap;

  return (
    <div className={`bg-slate-900 border-b-4 ${colorClasses[currentRank.color].split(' ')[0]} p-6 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden transition-all duration-700`}>
      
      {/* Dynamic Background Watermark */}
      <Icon className="absolute -right-10 -bottom-10 opacity-[0.03] rotate-12 transition-all duration-1000" size={220} />
      
      <div className="relative z-10 space-y-5">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`flex h-2 w-2 rounded-full animate-ping ${colorClasses[currentRank.color].split(' ')[2]}`} />
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${colorClasses[currentRank.color].split(' ')[1]}`}>
                Live Deployment
              </p>
            </div>
            <h2 className="text-white font-black text-3xl tracking-tighter italic uppercase flex items-center gap-3">
              {currentRank.name}
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              Unit: {CONFIG.DEPLOYMENT_YEAR} Selection <ChevronRight size={10} /> {currentRank.color} phase
            </p>
          </div>
          
          <div className="text-right">
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 backdrop-blur-md shadow-inner">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center">Net Effort</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-black text-white italic tabular-nums">{totalHours}</span>
                <span className={`text-[10px] font-bold uppercase ${colorClasses[currentRank.color].split(' ')[1]}`}>HRS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Promotion Tracker */}
        {nextRank && (
          <div className="space-y-2">
            <div className="flex justify-between items-end px-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                Next Objective: <span className="text-slate-300">{nextRank.name}</span>
              </p>
              <p className="text-[9px] font-black text-slate-400 uppercase tabular-nums">
                {Math.max(0, nextRank.minHours - totalHours)}h Remaining
              </p>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/50">
              <div 
                className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)] ${colorClasses[currentRank.color].split(' ')[2]}`}
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdentityHeader;