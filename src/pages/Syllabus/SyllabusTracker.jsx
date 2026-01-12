import React from 'react';
import { useSyllabus } from '../../hooks/useSyllabus';
import { SYLLABUS } from '../../data/syllabus';
import { CheckCircle2, Circle, BookOpen, Target, Loader2 } from 'lucide-react';
import ProgressBar from '../../components/Common/ProgressBar';

const SyllabusTracker = () => {
  const { completedTopics, toggleTopic, loading } = useSyllabus();

  if (loading) return (
    <div className="p-6 text-white text-center flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
      <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Scanning Knowledge Base...</p>
    </div>
  );

  return (
    <div className="p-6 space-y-10 pb-24 max-w-2xl mx-auto">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="text-emerald-500" size={20} />
          <h1 className="text-4xl font-black italic tracking-tighter text-white">SYLLABUS MASTER</h1>
        </div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] ml-1">Command Control • Knowledge Acquisition</p>
      </header>

      {Object.entries(SYLLABUS).map(([subject, topics]) => {
        const finishedCount = topics.filter(t => completedTopics.includes(t)).length;
        const percent = Math.round((finishedCount / topics.length) * 100);

        return (
          <section key={subject} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end px-1">
              <div>
                <h3 className="font-black text-lg text-white tracking-tight uppercase italic">{subject}</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                   {finishedCount} / {topics.length} Units Secured
                </p>
              </div>
              <span className={`text-xs font-black italic ${percent === 100 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {percent}%
              </span>
            </div>

            <ProgressBar value={percent} max={100} color={percent === 100 ? "emerald" : "blue"} />

            <div className="grid grid-cols-1 gap-2.5">
              {topics.map(topic => {
                const isMastered = completedTopics.includes(topic);
                return (
                  <button 
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${
                      isMastered 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-500' 
                        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-blue-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <div className={`p-1 rounded-md ${isMastered ? 'text-emerald-500' : 'text-slate-700'}`}>
                        <Target size={14} />
                      </div>
                      <span className={`text-xs font-medium tracking-tight ${isMastered ? 'line-through opacity-50' : 'opacity-100'}`}>
                        {topic}
                      </span>
                    </div>
                    
                    <div className={`transition-all duration-300 ${isMastered ? 'scale-110 text-emerald-500' : 'text-slate-800 group-hover:text-slate-600'}`}>
                      {isMastered ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      <footer className="pt-10 text-center">
        <div className="inline-block p-4 bg-slate-900 border border-slate-800 rounded-3xl">
           <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">
             Overall Mastery: {Math.round((completedTopics.length / Object.values(SYLLABUS).flat().length) * 100)}% 
           </p>
        </div>
      </footer>
    </div>
  );
};

export default SyllabusTracker;