import React from 'react';
import { getDaysUntil, EXAM_DATES } from '../../utils/dateUtils';
import { Timer, Trophy } from 'lucide-react';

const CountdownHeader = () => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
      {EXAM_DATES.map((exam) => {
        const daysLeft = getDaysUntil(exam.date);
        const isUrgent = daysLeft < 30;
        
        return (
          <div key={exam.name} className={`flex-shrink-0 card border-slate-800 py-3 px-5 flex items-center gap-4 min-w-[180px] transition-all ${isUrgent ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-900/50'}`}>
            <div className={`p-2 rounded-lg ${isUrgent ? 'bg-rose-500/20 text-rose-500' : 'bg-blue-500/20 text-blue-400'}`}>
               {isUrgent ? <Trophy size={16}/> : <Timer size={16} />}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{exam.name}</p>
              <p className={`text-lg font-black tracking-tighter ${isUrgent ? 'text-rose-400' : 'text-white'}`}>
                {daysLeft} <span className="text-[10px] font-normal text-slate-500 uppercase">Days</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CountdownHeader;