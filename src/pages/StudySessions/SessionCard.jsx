import React from "react";

const SessionCard = ({ session, onToggle, onTopicChange }) => {
  const isCompleted = session.status === "completed";

  return (
    <div
      className={`card transition-all duration-300 p-5 rounded-2xl border-2 ${
        isCompleted
          ? "border-emerald-500 bg-emerald-500/5 shadow-emerald-900/10 shadow-lg"
          : "border-slate-800 bg-slate-900"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-white">
            Session {session.session_number}
          </h3>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">
            2 Hours • Fixed Slot
          </p>
        </div>
        <button
          onClick={() => onToggle(session.id)}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
            isCompleted
              ? "bg-emerald-500 border-emerald-500 text-white scale-110"
              : "border-slate-700 hover:border-emerald-500 text-transparent"
          }`}
        >
          ✓
        </button>
      </div>

      <div className="mt-4">
        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
          Topic Focus
        </label>
        <input
          type="text"
          placeholder="What are you mastering?"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          value={session.topic || ""}
          onChange={(e) => onTopicChange(session.id, e.target.value)}
        />
      </div>
    </div>
  );
};

export default SessionCard;
