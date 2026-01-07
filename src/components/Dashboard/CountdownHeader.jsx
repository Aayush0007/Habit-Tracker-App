import React from 'react';
import { getDaysUntil, EXAM_DATES } from '../../utils/dateUtils';
import { Timer, Trophy, AlertCircle } from 'lucide-react';

const CountdownHeader = () => {
  // Sort exams by date so the closest ones appear first
  const sortedExams = [...EXAM_DATES].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
      {sortedExams.map((exam) => {
        const daysLeft = getDaysUntil(exam.date);
        const isUrgent = daysLeft < 30;
        const isMissed = daysLeft === 0;
        
        return (
          <div key={exam.name} className={`flex-shrink-0 card border-slate-800 py-3 px-5 flex items-center gap-4 min-w-[190px] transition-all ${isUrgent ? 'bg-rose-500/10 border-rose-500/30 ring-1 ring-rose-500/20' : 'bg-slate-900/50'}`}>
            <div className={`p-2 rounded-lg ${isUrgent ? 'bg-rose-500/20 text-rose-500' : 'bg-blue-500/20 text-blue-400'}`}>
               {isUrgent ? <AlertCircle size={16} className="animate-pulse"/> : <Timer size={16} />}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{exam.name}</p>
              <p className={`text-lg font-black tracking-tighter ${isUrgent ? 'text-rose-400' : 'text-white'}`}>
                {daysLeft} <span className="text-[10px] font-normal text-slate-500 uppercase tracking-normal">Days</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CountdownHeader;