import React, { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Line,
  ComposedChart,
} from "recharts";
import { supabase } from "../../supabaseClient";
import {
  Trophy,
  Target,
  Activity,
  Wifi,
  WifiOff,
  Filter,
  Loader2,
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Info,
  Swords,
} from "lucide-react";

const Analytics = () => {
  const [mockData, setMockData] = useState([]);
  const [stats, setStats] = useState({ avg: 0, best: 0, total: 0, delta: 0 });
  const [subjectAverages, setSubjectAverages] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from("mock_exams")
        .select("*")
        .eq("user_id", user.id);
      if (filter !== "All") query = query.eq("category", filter);

      const { data: allMocks, error } = await query;
      if (error || !allMocks) {
        setLoading(false);
        return;
      }

      const sortedMocks = [...allMocks].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // SMART AVERAGING: Count sections only if they are not null
      const sums = { quants: 0, reasoning: 0, english: 0, gs: 0 };
      const counts = { quants: 0, reasoning: 0, english: 0, gs: 0 };

      allMocks.forEach((m) => {
        ["quants", "reasoning", "english", "gs"].forEach((sec) => {
          if (m.sections?.[sec] !== null && m.sections?.[sec] !== undefined) {
            sums[sec] += m.sections[sec];
            counts[sec] += 1;
          }
        });
      });

      const finalSubjectAverages = [
        {
          subject: "Quants",
          score: counts.quants ? sums.quants / counts.quants : 0,
        },
        {
          subject: "Reasoning",
          score: counts.reasoning ? sums.reasoning / counts.reasoning : 0,
        },
        {
          subject: "English",
          score: counts.english ? sums.english / counts.english : 0,
        },
        { subject: "GS/GA", score: counts.gs ? sums.gs / counts.gs : 0 },
      ].filter((s) => s.score > 0);

      setSubjectAverages(finalSubjectAverages);

      const count = allMocks.length || 1;
      const recentAvg =
        sortedMocks.slice(-3).reduce((acc, m) => acc + m.score, 0) /
        Math.min(count, 3);
      const prevAvg =
        sortedMocks.length > 3
          ? sortedMocks.slice(-6, -3).reduce((acc, m) => acc + m.score, 0) / 3
          : recentAvg;

      setStats({
        avg: (allMocks.reduce((a, b) => a + b.score, 0) / count).toFixed(1),
        best: Math.max(...allMocks.map((m) => m.score), 0),
        total: allMocks.length,
        delta: (recentAvg - prevAvg).toFixed(1),
      });

      setMockData(
        sortedMocks.map((m, i, arr) => {
          const slice = arr.slice(Math.max(0, i - 2), i + 1);
          return {
            ...m,
            movingAvg: (
              slice.reduce((acc, curr) => acc + curr.score, 0) / slice.length
            ).toFixed(1),
          };
        })
      );
      setLoading(false);
    };
    getData();
  }, [filter]);

  const weakest = [...subjectAverages].sort((a, b) => a.score - b.score)[0];

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <Loader2 className="text-blue-500 animate-spin mb-4" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          Syncing Intelligence
        </p>
      </div>
    );

  return (
    <div className="p-6 space-y-8 pb-24 max-w-2xl mx-auto min-w-0">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none">
            Intelligence
          </h1>
          <div className="flex items-center gap-3 mt-4 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-lg focus-within:border-blue-500/50 transition-all">
            <Filter size={14} className="text-blue-500 ml-1" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-900 text-[10px] font-black text-white uppercase outline-none cursor-pointer pr-4 min-w-[160px]"
            >
              <option value="All" className="bg-slate-900 text-white">
                Global Overview
              </option>

              <optgroup
                label="Defense & Tech Ops"
                className="bg-slate-800 text-slate-400 font-bold"
              >
                <option
                  value="AFCAT 1"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  AFCAT 1
                </option>
                <option
                  value="AFCAT 2"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  AFCAT 2
                </option>
                <option
                  value="RRB NTPC"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  RRB NTPC
                </option>
                <option
                  value="RPSC Comp"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  RPSC Comp
                </option>
              </optgroup>

              <optgroup
                label="SBI Operations"
                className="bg-slate-800 text-slate-400 font-bold"
              >
                <option
                  value="SBI PO Pre"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  SBI PO Pre
                </option>
                <option
                  value="SBI PO Mains"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  SBI PO Mains
                </option>
                <option
                  value="SBI Clerk Pre"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  SBI Clerk Pre
                </option>
              </optgroup>

              <optgroup
                label="IBPS Operations"
                className="bg-slate-800 text-slate-400 font-bold"
              >
                <option
                  value="IBPS PO Pre"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  IBPS PO Pre
                </option>
                <option
                  value="IBPS PO Mains"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  IBPS PO Mains
                </option>
                <option
                  value="IBPS SO Pre"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  IBPS SO Pre
                </option>
                <option
                  value="IBPS SO Mains"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  IBPS SO Mains
                </option>
                <option
                  value="IBPS Clerk Pre"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  IBPS Clerk Pre
                </option>
                <option
                  value="IBPS Clerk Main"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  IBPS Clerk Main
                </option>
              </optgroup>

              <optgroup
                label="Gramin Bank (RRB)"
                className="bg-slate-800 text-slate-400 font-bold"
              >
                <option
                  value="RRB PO Pre"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  RRB PO Pre
                </option>
                <option
                  value="RRB PO Mains"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  RRB PO Mains
                </option>
                <option
                  value="RRB Clerk Pre"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  RRB Clerk Pre
                </option>
                <option
                  value="RRB Clerk Mains"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  RRB Clerk Mains
                </option>
              </optgroup>

              <optgroup
                label="Regulatory Bodies"
                className="bg-slate-800 text-slate-400 font-bold"
              >
                <option
                  value="RBI Grade B"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  RBI Grade B
                </option>
                <option
                  value="NABARD Gr A"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  NABARD Gr A
                </option>
                <option
                  value="SEBI Gr A"
                  className="bg-slate-900 text-white italic text-[11px]"
                >
                  SEBI Gr A
                </option>
              </optgroup>
            </select>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={<Activity size={20} />}
          label="Avg Score"
          value={stats.avg}
          color="text-blue-400"
          delta={stats.delta}
        />
        <StatCard
          icon={<Trophy size={20} />}
          label="Best"
          value={stats.best}
          color="text-emerald-400"
        />
        <StatCard
          icon={<Swords size={20} />}
          label="Total"
          value={stats.total}
          color="text-purple-400"
        />
      </div>

      <section className="card bg-slate-900 border-2 border-slate-800 p-6 rounded-3xl shadow-2xl">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">
          {filter} Proficiency Map
        </h3>
        <div className="h-[280px] w-full">
          <ResponsiveContainer>
            <RadarChart data={subjectAverages}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }}
              />
              <Radar
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.4}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  fontSize: "10px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card bg-slate-900 border-2 border-slate-800 p-6 rounded-3xl shadow-2xl">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">
          {filter} Stability
        </h3>
        <div className="h-[220px] w-full">
          <ResponsiveContainer>
            <ComposedChart data={mockData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />
              <XAxis dataKey="date" hide />
              <YAxis
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  fontSize: "10px",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={0.05}
                fill="#3b82f6"
              />
              <Line
                type="monotone"
                dataKey="movingAvg"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                strokeDasharray="5 5"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="card bg-blue-600/5 border-2 border-blue-500/20 p-6 rounded-3xl flex gap-5 items-start shadow-xl">
        <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-500">
          <Info size={24} />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">
            Tactical Advice • {filter}
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            {mockData.length < 3
              ? "Initial analysis pending. Log 3 mocks in this category to generate specific advice."
              : `Current bottleneck in ${filter} is ${
                  weakest?.subject
                }. Sectional score of ${weakest?.score.toFixed(
                  1
                )} is currently the limiting factor in your deployment readiness.`}
          </p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, delta }) => (
  <div className="card flex flex-col items-center justify-center p-5 border-2 border-slate-800 bg-slate-900 rounded-3xl shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
    <div className={`${color} mb-3`}>{icon}</div>
    <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
      {label}
    </span>
    <div className="flex items-end gap-1">
      <span className={`text-2xl font-black italic ${color} tabular-nums`}>
        {value}
      </span>
      {delta !== undefined && (
        <span
          className={`text-[10px] font-black mb-1 flex items-center ${
            parseFloat(delta) >= 0 ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {parseFloat(delta) >= 0 ? (
            <TrendingUp size={12} className="mr-0.5" />
          ) : (
            <TrendingDown size={12} className="mr-0.5" />
          )}
          {Math.abs(delta)}
        </span>
      )}
    </div>
  </div>
);

export default Analytics;
