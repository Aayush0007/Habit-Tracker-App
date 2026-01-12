import React, { useState } from "react";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import { 
  Target, BarChart3, ChevronRight, Swords, Activity, Zap
} from "lucide-react";
import CountdownHeader from "../../components/Dashboard/CountdownHeader";
import IdentityHeader from "../../components/IdentityHeader";
import { CONFIG } from "../../config";

const Dashboard = () => {
  const [activeExam, setActiveExam] = useState("AFCAT"); 
  const { 
    totalHours, 
    status, 
    workoutDone, 
    revisionDone, 
    readiness, 
    mockAvg, 
    loading 
  } = useDashboardStats(activeExam);

  // Dynamic feedback logic for visual indexing
  const getReadinessLevel = (val) => {
    if (val >= 90) return { label: "Combat Ready", color: "text-emerald-400", glow: "shadow-emerald-500/20" };
    if (val >= 70) return { label: "Deployment Ready", color: "text-blue-400", glow: "shadow-blue-500/20" };
    if (val >= 40) return { label: "In Training", color: "text-amber-400", glow: "shadow-amber-500/20" };
    return { label: "Critical Weakness", color: "text-rose-400", glow: "shadow-rose-500/20" };
  };

  const level = getReadinessLevel(readiness);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <div className="absolute inset-0 m-auto h-8 w-8 bg-blue-500/10 rounded-full animate-pulse"></div>
      </div>
      <p className="mt-8 text-slate-500 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">
        Synchronizing Tactical Intel...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pb-32">
      <IdentityHeader totalHours={totalHours} />

      <div className="p-6 space-y-8 max-w-2xl mx-auto">
        
        {/* OPERATIONAL TIMELINE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Activity size={14} className="text-blue-500" />
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Timeline</h3>
          </div>
          <CountdownHeader />
        </section>

        {/* STRATEGIC OBJECTIVE SELECTOR */}
        <div className="group relative bg-slate-900/40 backdrop-blur-md p-1 rounded-3xl border border-slate-800 focus-within:border-blue-500/50 transition-all duration-500">
          <div className="flex items-center gap-4 p-3">
            <div className="p-2.5 bg-blue-500/10 rounded-2xl text-blue-500 border border-blue-500/20 shadow-inner">
              <Target size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Active Theater of Ops</p>
              <select
                value={activeExam}
                onChange={(e) => setActiveExam(e.target.value)}
                className="w-full bg-transparent text-white text-sm font-black uppercase outline-none cursor-pointer appearance-none italic tracking-tight"
              >
                <option className="bg-slate-900">AFCAT</option>
                <option className="bg-slate-900">SBI PO Pre</option>
                <option className="bg-slate-900">SBI Clerk Pre</option>
                <option className="bg-slate-900">IBPS PO Pre</option>
                <option className="bg-slate-900">SSC CGL/CHSL</option>
                <option className="bg-slate-900">RRB NTPC</option>
                <option className="bg-slate-900">RBI Grade B</option>
                <option className="bg-slate-900">RPSC Comp</option>
              </select>
            </div>
            <ChevronRight size={18} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>

        {/* CORE READINESS MODULE */}
        <section className={`card bg-slate-900/80 border-2 border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all duration-500 ${level.glow}`}>
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1.5 rounded-full border border-slate-800 w-fit">
                <span className={`w-2 h-2 rounded-full bg-current animate-ping ${level.color}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${level.color}`}>{level.label}</span>
              </div>
              <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Readiness Index</h3>
            </div>
            <div className="text-right">
              <span className={`text-5xl font-black italic tracking-tighter tabular-nums ${level.color}`}>{readiness}%</span>
            </div>
          </div>

          <div className="w-full bg-slate-950 h-5 rounded-full overflow-hidden mb-10 border border-slate-800 p-1 relative shadow-inner">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full relative ${level.color.replace('text', 'bg')}`} 
              style={{ width: `${readiness}%` }} 
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800/50 relative z-10">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Mock Intelligence</p>
              <p className="text-2xl font-black text-white italic tabular-nums">{mockAvg} <span className="text-[10px] text-slate-500 not-italic">AVG</span></p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">System Sync</p>
              <div className="flex items-center justify-end gap-2 text-emerald-500">
                <Activity size={12} className="animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest">Live Uplink</span>
              </div>
            </div>
          </div>
          <Swords className="absolute -right-10 -bottom-10 text-white opacity-[0.02] rotate-12 pointer-events-none" size={240} />
        </section>

        {/* MISSION LOG PROGRESS */}
        <section className="card bg-slate-900 border-2 border-slate-800 p-7 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Fuel Reserve (Today)</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white italic tracking-tighter tabular-nums">{totalHours}</span>
                <span className="text-slate-600 font-bold text-sm uppercase">/ {CONFIG.ELITE_TARGET_HOURS} HRS</span>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase border-2 transition-all duration-500 ${status?.color.replace("text", "border").replace("400", "500/30")} bg-slate-950/50 backdrop-blur-md`}>
              {status?.label}
            </div>
          </div>
          
          <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-1000 ease-out rounded-full" 
              style={{ width: `${Math.min((totalHours / CONFIG.ELITE_TARGET_HOURS) * 100, 100)}%` }} 
            />
          </div>
        </section>

        {/* HABIT TOGGLES */}
        <div className="grid grid-cols-2 gap-4">
          <HabitCard 
            active={workoutDone} 
            icon={<Zap size={22} />} 
            label="Physical" 
            subLabel="Workout"
            activeColor="border-emerald-500/50 bg-emerald-500/5 text-emerald-400 shadow-emerald-500/10"
          />
          <HabitCard 
            active={revisionDone} 
            icon={<Target size={22} />} 
            label="Mental" 
            subLabel="Revision"
            activeColor="border-blue-500/50 bg-blue-500/5 text-blue-400 shadow-blue-500/10"
          />
        </div>
      </div>
    </div>
  );
};

const HabitCard = ({ active, icon, label, subLabel, activeColor }) => (
  <div className={`card p-6 rounded-[2rem] border-2 flex flex-col items-center justify-center gap-3 transition-all duration-500 shadow-xl ${
    active ? activeColor : "border-slate-800 bg-slate-900/40 text-slate-600 grayscale opacity-40 hover:opacity-70 hover:grayscale-0"
  }`}>
    <div className={`transition-transform duration-500 ${active ? 'scale-125' : 'scale-100'}`}>
      {icon}
    </div>
    <div className="text-center space-y-0.5">
      <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
      <p className="text-[8px] font-bold uppercase tracking-tighter opacity-60">
        {subLabel}
      </p>
    </div>
  </div>
);

export default Dashboard;