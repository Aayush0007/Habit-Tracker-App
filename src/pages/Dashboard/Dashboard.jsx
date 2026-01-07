import React, { useState } from "react"; // Added useState import
import { useDashboardStats } from "../../hooks/useDashboardStats";
import { Trophy, Flame, Zap, Target, BarChart3 } from "lucide-react";
import CountdownHeader from "../../components/Dashboard/CountdownHeader";

const Dashboard = () => {
  // 1. Move State and Hook calls to the top
  const [activeExam, setActiveExam] = useState("SBI PO Pre");
  
  const {
    totalHours,
    status,
    workoutDone,
    revisionDone,
    readiness,
    mockAvg,
    loading,
  } = useDashboardStats(activeExam);

  // 2. Perform the loading check AFTER initialization
  if (loading) {
    return (
      <div className="p-6 text-white text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-slate-400">Loading Command Center...</p>
      </div>
    );
  }

  // 3. Logic calculation
  const progressPercent = (totalHours / 12) * 100;

  return (
    <div className="p-6 space-y-6 pb-24">
      <CountdownHeader />

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter">
            WARRIOR MODE
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Focus: {activeExam}
          </p>
        </div>
        <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
          <Flame className="text-orange-500" fill="currentColor" size={24} />
        </div>
      </header>

      {/* Main Study Progress */}
      <section className="card bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-6 rounded-2xl">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-5xl font-black text-white">{totalHours}</span>
            <span className="text-slate-500 font-bold ml-2">/ 12 HRS</span>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${status?.color
              ?.replace("text", "border")
              ?.replace("400", "500/50")} bg-slate-900`}
          >
            {status?.label}
          </div>
        </div>

        <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </section>

      {/* Exam Selector */}
      <div className="flex items-center gap-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Exam:</label>
        <select
          value={activeExam}
          onChange={(e) => setActiveExam(e.target.value)}
          className="bg-slate-800 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg border border-slate-700 outline-none focus:border-blue-500 transition-colors cursor-pointer"
        >
          <option>SBI PO Pre</option>
          <option>SBI Clerk Pre</option>
          <option>IBPS PO Pre</option>
          <option>SSC CGL/CHSL</option>
          <option>RBI Grade B</option>
          <option>AFCAT</option>
          <option>RPSC Computer Inst.</option>
        </select>
      </div>

      {/* Readiness Section */}
      <section className="card bg-slate-900 border-slate-800 p-5 rounded-2xl">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-400" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">
              {activeExam} Readiness
            </h3>
          </div>
          <span className="text-xl font-black text-blue-400">{readiness}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)] transition-all duration-1000"
            style={{ width: `${readiness}%` }}
          />
        </div>
        <div className="flex justify-between mt-3">
          <p className="text-[10px] text-slate-500">
            Mock Avg: <span className="text-slate-300">{mockAvg}</span>
          </p>
          <p className="text-[10px] text-slate-500 italic">
            *Based on syllabus & mocks
          </p>
        </div>
      </section>

      {/* Habit Quick View */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className={`card flex flex-col items-center justify-center p-4 gap-2 border-2 rounded-2xl transition-all ${
            workoutDone
              ? "border-emerald-500/50 bg-emerald-500/5"
              : "border-slate-800 opacity-50"
          }`}
        >
          <Zap
            size={20}
            className={workoutDone ? "text-emerald-400" : "text-slate-600"}
          />
          <span className="text-[10px] font-black uppercase text-slate-400">
            Workout
          </span>
        </div>
        <div
          className={`card flex flex-col items-center justify-center p-4 gap-2 border-2 rounded-2xl transition-all ${
            revisionDone
              ? "border-blue-500/50 bg-blue-500/5"
              : "border-slate-800 opacity-50"
          }`}
        >
          <Target
            size={20}
            className={revisionDone ? "text-blue-400" : "text-slate-600"}
          />
          <span className="text-[10px] font-black uppercase text-slate-400">
            Revision
          </span>
        </div>
      </div>

      {/* Insight */}
      <div className="card bg-slate-900 border-dashed border-slate-700 p-4 rounded-2xl">
        <div className="flex gap-3 items-center">
          <div className="bg-amber-500/20 p-2 rounded-full">
            <Trophy className="text-amber-500" size={18} />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {readiness < 50
              ? `Your ${activeExam} readiness is growing. Tick off more syllabus topics to increase your score.`
              : "You're crossing the danger zone into elite territory. Push those mocks!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;