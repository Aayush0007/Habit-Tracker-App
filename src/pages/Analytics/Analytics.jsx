import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { initDB } from '../../db/indexedDB/dbConfig';
import { Trophy, Target, Activity } from 'lucide-react';

const Analytics = () => {
  const [mockData, setMockData] = useState([]);
  const [stats, setStats] = useState({ avg: 0, best: 0, total: 0 });

  useEffect(() => {
    const getData = async () => {
      const db = await initDB();
      const allMocks = await db.getAll('mock_exams');
      
      // Sort by date for the graph
      const sortedMocks = allMocks.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      const scores = allMocks.map(m => Number(m.score));
      setStats({
        avg: scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0,
        best: scores.length ? Math.max(...scores) : 0,
        total: scores.length
      });
      setMockData(sortedMocks);
    };
    getData();
  }, []);

  return (
    <div className="p-6 space-y-8 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-white">Performance Insights</h1>
        <p className="text-slate-400 text-sm">Data-driven preparation for 2026</p>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<Activity size={16}/>} label="Avg Score" value={stats.avg} color="text-blue-400" />
        <StatCard icon={<Trophy size={16}/>} label="Best" value={stats.best} color="text-emerald-400" />
        <StatCard icon={<Target size={16}/>} label="Total" value={stats.total} color="text-purple-400" />
      </div>

      {/* Mock Score Trend Line Chart */}
      <section className="card bg-slate-900 border-slate-800">
        <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">Score Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="date" 
                hide 
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Efficiency Logic Placeholder */}
      <div className="card bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
        <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Aspirant Insight</p>
        <p className="text-sm text-slate-300 leading-relaxed">
          {mockData.length < 3 
            ? "Log at least 3 mocks to see your preparation trajectory."
            : "Your score trend is stabilizing. Focus on accuracy in Quants to break the plateau."}
        </p>
      </div>
    </div>
  );
};

// Internal StatCard component for clean code
const StatCard = ({ icon, label, value, color }) => (
  <div className="card flex flex-col items-center justify-center p-3 border-slate-800">
    <div className={`${color} mb-1 opacity-80`}>{icon}</div>
    <span className="text-[9px] font-bold text-slate-500 uppercase mb-1">{label}</span>
    <span className={`text-xl font-black ${color}`}>{value}</span>
  </div>
);

export default Analytics;