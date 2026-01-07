import React, { useState, useEffect } from "react";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area,
  Radar, RadarChart, PolarGrid, PolarAngleAxis
} from "recharts";
import { initDB } from "../../db/indexedDB/dbConfig";
import { Trophy, Target, Activity, Wifi, WifiOff } from "lucide-react";

const Analytics = () => {
  const [mockData, setMockData] = useState([]);
  const [stats, setStats] = useState({ avg: 0, best: 0, total: 0 });
  const [subjectAverages, setSubjectAverages] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);

    const getData = async () => {
      const db = await initDB();
      const allMocks = await db.getAll("mock_exams");

      const sortedMocks = allMocks.sort((a, b) => new Date(a.date) - new Date(b.date));
      const scores = allMocks.map((m) => Number(m.score));

      // Calculate Subject Proficiencies
      const sums = { quants: 0, reasoning: 0, english: 0 };
      allMocks.forEach(m => {
        sums.quants += (m.sections?.quants || 0);
        sums.reasoning += (m.sections?.reasoning || 0);
        sums.english += (m.sections?.english || 0);
      });

      const count = allMocks.length || 1;
      setSubjectAverages([
        { subject: "Quants", score: (sums.quants / count).toFixed(1), fullMark: 35 },
        { subject: "Reasoning", score: (sums.reasoning / count).toFixed(1), fullMark: 35 },
        { subject: "English", score: (sums.english / count).toFixed(1), fullMark: 30 },
      ]);

      setStats({
        avg: scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0,
        best: scores.length ? Math.max(...scores) : 0,
        total: scores.length,
      });
      setMockData(sortedMocks);
    };

    getData();
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  return (
    <div className="p-6 space-y-8 pb-24">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Performance Insights</h1>
          <p className="text-slate-400 text-sm">Data-driven preparation for 2026</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${isOnline ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
          {isOnline ? <Wifi size={12}/> : <WifiOff size={12}/>}
          {isOnline ? 'SYNCED' : 'OFFLINE'}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<Activity size={16} />} label="Avg Score" value={stats.avg} color="text-blue-400" />
        <StatCard icon={<Trophy size={16} />} label="Best" value={stats.best} color="text-emerald-400" />
        <StatCard icon={<Target size={16} />} label="Total Mocks" value={stats.total} color="text-purple-400" />
      </div>

      {/* Subject Radar Chart */}
      <section className="card bg-slate-900 border-slate-800 p-4">
        <h3 className="text-xs font-black text-slate-500 uppercase mb-6 tracking-widest">Sectional Proficiency</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={subjectAverages}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Radar
                name="Proficiency"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.5}
              />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", fontSize: "10px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Trend Chart */}
      <section className="card bg-slate-900 border-slate-800 p-4">
        <h3 className="text-xs font-black text-slate-500 uppercase mb-6 tracking-widest">Score Trend</h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
              />
              <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
      
      <div className="card bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700 p-4">
        <p className="text-[10px] font-black text-slate-500 uppercase mb-2 italic">Smart Mentor Insight</p>
        <p className="text-sm text-slate-300 leading-relaxed">
          {mockData.length < 3 ? "Complete 3 mocks to unlock AI insights." : 
           subjectAverages[0]?.score < 20 ? "Your Quants score is below average. Prioritize 'Data Interpretation' in your next study block." :
           "You are maintaining good balance. Focus on reducing time per question in Reasoning."}
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="card flex flex-col items-center justify-center p-3 border-slate-800 bg-slate-900">
    <div className={`${color} mb-1 opacity-80`}>{icon}</div>
    <span className="text-[9px] font-bold text-slate-500 uppercase mb-1">{label}</span>
    <span className={`text-xl font-black ${color}`}>{value}</span>
  </div>
);

export default Analytics;