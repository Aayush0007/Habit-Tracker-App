import React from 'react';
import { getDaysUntil, EXAM_DATES } from '../../utils/dateUtils';
import { Timer } from 'lucide-react';

const CountdownHeader = () => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
      {EXAM_DATES.map((exam) => {
        const daysLeft = getDaysUntil(exam.date);
        return (
          <div key={exam.name} className="flex-shrink-0 card bg-slate-900/50 border-slate-800 py-2 px-4 flex items-center gap-3">
            <Timer size={14} className={exam.color} />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{exam.name}</p>
              <p className="text-sm font-black text-white">{daysLeft} Days Left</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CountdownHeader;