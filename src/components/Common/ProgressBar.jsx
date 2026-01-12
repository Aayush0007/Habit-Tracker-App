import React from 'react';

const ProgressBar = ({ value, max, color = "blue", showLabel = false }) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const colorMap = {
    blue: "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]",
    emerald: "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]",
    rose: "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]",
    amber: "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
  };

  return (
    <div className="w-full space-y-2">
      {showLabel && (
        <div className="flex justify-between items-end px-1">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progress</span>
          <span className={`text-xs font-black italic ${percentage === 100 ? 'text-emerald-400' : 'text-slate-300'}`}>
            {percentage}%
          </span>
        </div>
      )}
      
      <div className="w-full bg-slate-900 h-3.5 rounded-full border-2 border-slate-800 overflow-hidden p-0.5 relative">
        {/* Subtle Background Track Glow */}
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out relative z-10 ${colorMap[color]} ${percentage === 100 ? 'animate-pulse' : ''}`} 
          style={{ width: `${percentage}%` }} 
        >
          {/* Internal Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;