import React, { useState, useEffect } from "react";

const SessionCard = ({ session, onToggle, onTopicChange }) => {
  const isCompleted = session.status === "completed";
  const [localTopic, setLocalTopic] = useState(session.topic || "");

  // Sync local state if session changes from outside (e.g., refresh)
  useEffect(() => {
    setLocalTopic(session.topic || "");
  }, [session.topic]);

  const handleBlur = () => {
    if (localTopic !== session.topic) {
      onTopicChange(session.id, localTopic);
    }
  };

  return (
    <div className={`card transition-all duration-500 p-5 rounded-[2rem] border-2 ${
        isCompleted ? "border-emerald-500 bg-emerald-500/5 shadow-lg" : "border-slate-800 bg-slate-900"
      }`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Session {session.session_number}</h3>
          <p className="text-slate-500 text-[9px] uppercase font-bold tracking-[0.2em]">Deployment: 2 Hours</p>
        </div>
        <button
          onClick={() => onToggle(session.id)}
          className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
            isCompleted ? "bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20 shadow-lg scale-110" : "border-slate-700 text-transparent hover:border-emerald-500/50"
          }`}
        >
          ✓
        </button>
      </div>

      <div className="mt-5 space-y-1.5">
        <label className="text-[8px] uppercase tracking-[0.3em] text-slate-600 font-black ml-1">Focus Topic</label>
        <input
          type="text"
          placeholder="Awaiting Mission Intel..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500 transition-all"
          value={localTopic}
          onChange={(e) => setLocalTopic(e.target.value)}
          onBlur={handleBlur} // Save when user clicks away
        />
      </div>
    </div>
  );
};

export default SessionCard;