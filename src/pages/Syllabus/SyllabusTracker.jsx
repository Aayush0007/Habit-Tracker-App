import React, { useState, useEffect } from 'react';
import { SYLLABUS } from '../../data/syllabus';
import { initDB } from '../../db/indexedDB/dbConfig';
import { CheckCircle2, Circle } from 'lucide-react';

const SyllabusTracker = () => {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const loadProgress = async () => {
      const db = await initDB();
      const progress = await db.getAll('syllabus_progress');
      setCompleted(progress.map(p => p.topicName));
    };
    loadProgress();
  }, []);

  const toggleTopic = async (topic) => {
    const db = await initDB();
    if (completed.includes(topic)) {
      await db.delete('syllabus_progress', topic);
      setCompleted(prev => prev.filter(t => t !== topic));
    } else {
      await db.add('syllabus_progress', { topicName: topic, date: new Date().toISOString() });
      setCompleted(prev => [...prev, topic]);
    }
  };

  return (
    <div className="p-6 space-y-8 pb-24">
      <header>
        <h1 className="text-2xl font-bold">Syllabus Progress</h1>
        <p className="text-slate-400 text-sm italic">Master every topic for 2026</p>
      </header>

      {Object.entries(SYLLABUS).map(([subject, topics]) => {
        const finishedCount = topics.filter(t => completed.includes(t)).length;
        const percent = Math.round((finishedCount / topics.length) * 100);

        return (
          <div key={subject} className="space-y-3">
            <div className="flex justify-between items-end">
              <h3 className="font-bold text-lg text-emerald-400">{subject}</h3>
              <span className="text-[10px] font-black text-slate-500 uppercase">{percent}% Done</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-700" style={{width: `${percent}%`}} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              {topics.map(topic => (
                <button 
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl"
                >
                  <span className={`text-sm ${completed.includes(topic) ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{topic}</span>
                  {completed.includes(topic) ? <CheckCircle2 size={18} className="text-emerald-500"/> : <Circle size={18} className="text-slate-700"/>}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SyllabusTracker;