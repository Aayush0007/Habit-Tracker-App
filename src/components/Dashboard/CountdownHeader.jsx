import React from 'react';
import { getDaysUntil, EXAM_DATES } from '../../utils/dateUtils';
import { Timer, AlertTriangle, Target, Zap } from 'lucide-react';

const CountdownHeader = () => {
  // 1. Filter out past exams and sort upcoming ones by proximity
  const upcomingExams = [...EXAM_DATES]
    .filter(exam => getDaysUntil(exam.date) > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6 cursor-grab active:cursor-grabbing">
      {upcomingExams.map((exam) => {
        const daysLeft = getDaysUntil(exam.date);
        const isCritical = daysLeft <= 7;
        const isUrgent = daysLeft <= 30;
        
        return (
          <div 
            key={exam.name} 
            className={`flex-shrink-0 card border-2 py-4 px-5 flex items-center gap-4 min-w-[210px] transition-all duration-500 rounded-3xl relative overflow-hidden
              ${isCritical 
                ? 'bg-rose-500/10 border-rose-500/40 ring-2 ring-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]' 
                : isUrgent 
                  ? 'bg-amber-500/5 border-amber-500/30' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
          >
            {/* Background Glow for Critical Exams */}
            {isCritical && (
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-rose-500/10 blur-2xl rounded-full" />
            )}

            <div className={`p-3 rounded-2xl border ${
              isCritical 
                ? 'bg-rose-500/20 text-rose-500 border-rose-500/30' 
                : isUrgent 
                  ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' 
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
               {isCritical ? <Zap size={18} className="animate-bounce" /> : <Target size={18} />}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <p className={`text-[9px] font-black uppercase tracking-[0.25em] ${isCritical ? 'text-rose-400' : 'text-slate-500'}`}>
                  {exam.name}
                </p>
                {isCritical && <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />}
              </div>
              
              <p className={`text-2xl font-black tracking-tighter leading-none ${isCritical ? 'text-white' : 'text-slate-100'}`}>
                {daysLeft} 
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1.5 italic">Days</span>
              </p>
              
              <p className="text-[8px] font-medium text-slate-600 uppercase tracking-tighter">
                Deploy: {new Date(exam.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
              </p>
            </div>
          </div>
        );
      })}
      
      {/* Empty State if all exams are passed */}
      {upcomingExams.length === 0 && (
        <div className="w-full card bg-slate-900/50 border-dashed border-slate-800 p-8 text-center rounded-3xl">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">All Operations Concluded</p>
        </div>
      )}
    </div>
  );
};

export default CountdownHeader;