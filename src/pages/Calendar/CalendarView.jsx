import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { getDaysInMonth, getFirstDayOfMonth } from "../../utils/calendarUtils";
import {
  Calendar as CalendarIcon,
  Zap,
  ShieldCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Filter,
  Clock,
  CalendarDays,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const CalendarView = () => {
  const [logs, setLogs] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. STATE FOR GRAPH DATE RANGE
  const [dateRange, setDateRange] = useState({
  start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
});

  // Get current IST Date
  const getISTDate = () => {
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const parts = new Intl.DateTimeFormat("en-IN", options).formatToParts(
      new Date(),
    );
    const d = parts.find((p) => p.type === "day").value;
    const m = parts.find((p) => p.type === "month").value;
    const y = parts.find((p) => p.type === "year").value;
    return {
      year: parseInt(y),
      month: parseInt(m) - 1,
      dateStr: `${y}-${m}-${d}`,
    };
  };

  const ist = getISTDate();
  const [currentDate, setCurrentDate] = useState(
    new Date(ist.year, ist.month, 1),
  );

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const days = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Calendar month boundaries
      const calStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const calEnd = `${year}-${String(month + 1).padStart(2, "0")}-${days}`;

      // Fetch data spanning both the Calendar view AND the Graph custom range
      const overallStart =
        dateRange.start < calStart ? dateRange.start : calStart;
      const overallEnd = dateRange.end > calEnd ? dateRange.end : calEnd;

      const { data: sessions } = await supabase
        .from("study_sessions")
        .select("date, status")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .gte("date", dateRange.start) // Start Filter
        .lte("date", dateRange.end);

      const dayMap = {};
      sessions?.forEach((session) => {
        dayMap[session.date] = (dayMap[session.date] || 0) + 2;
      });

      // Map for Calendar Colors (Only for current viewed month)
      const statusMap = {};
      Object.entries(dayMap).forEach(([date, hours]) => {
        if (date >= calStart && date <= calEnd) {
          if (hours >= 10) statusMap[date] = "elite";
          else if (hours >= 8) statusMap[date] = "target";
          else if (hours >= 4) statusMap[date] = "partial";
          else statusMap[date] = "missed";
        }
      });

      // Prepare Data for Graph (Only for selected range)
      const formattedGraphData = Object.entries(dayMap)
        .filter(([date]) => date >= dateRange.start && date <= dateRange.end)
        .map(([date, hours]) => ({
          date: new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
          hours: hours,
          fullDate: date,
        }))
        .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

      setLogs(statusMap);
      setGraphData(formattedGraphData);
      setLoading(false);
    };
    fetchData();
  }, [currentDate, dateRange, month, year, days]);

  const getDayColor = (status) => {
    switch (status) {
      case "elite":
        return "bg-purple-600/20 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.3)]";
      case "target":
        return "bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
      case "partial":
        return "bg-amber-600/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]";
      case "missed":
        return "bg-rose-600/20 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]";
      default:
        return "bg-slate-900 border-slate-800 text-slate-600";
    }
  };

  const changeMonth = (offset) =>
    setCurrentDate(new Date(year, month + offset, 1));
  const calendarGrid = Array(firstDay)
    .fill(null)
    .concat([...Array(days).keys()]);

  return (
    <div className="p-4 md:p-10 space-y-10 pb-32 max-w-5xl mx-auto">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <CalendarIcon className="text-blue-500" size={24} />
            <h1 className="text-3xl md:text-4xl font-black italic text-white tracking-tighter uppercase leading-none">
              Consistency Map
            </h1>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-2 justify-center md:justify-start">
            <Clock size={12} className="text-blue-500" />
            IST Sync:{" "}
            {currentDate.toLocaleString("default", {
              month: "long",
            })}{" "}
            {year}
          </p>
        </div>
        <div className="flex gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 backdrop-blur-md">
          <button
            onClick={() => changeMonth(-1)}
            className="p-3 hover:text-blue-400 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center px-4 text-[12px] font-black text-white uppercase tracking-widest border-x border-slate-800">
            {currentDate.toLocaleString("default", { month: "short" })}
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="p-3 hover:text-blue-400 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </header>

      {/* CALENDAR SECTION */}
      <div className="card p-4 md:p-8 bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] shadow-2xl relative">
        {loading && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-30 flex items-center justify-center rounded-[2.5rem]">
            <Loader2 className="text-blue-500 animate-spin" size={32} />
          </div>
        )}
        <div className="grid grid-cols-7 mb-8 border-b border-slate-800 pb-4">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
            <div
              key={d}
              className="text-center text-[8px] md:text-[10px] font-black text-slate-600 tracking-widest"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-4">
          {calendarGrid.map((day, index) => {
            if (day === null) return <div key={`empty-${index}`} />;
            const dayNum = day + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
            const status = logs[dateStr] || "none";
            const isToday = dateStr === ist.dateStr;

            return (
              <div
                key={dateStr}
                className="aspect-square flex items-center justify-center relative"
              >
                <div
                  className={`w-full h-full max-w-[50px] max-h-[50px] rounded-xl md:rounded-2xl flex items-center justify-center text-xs md:text-lg font-black border-2 ${getDayColor(status)} ${isToday ? "ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-950 scale-105 z-10" : ""}`}
                >
                  {dayNum}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <LegendItem color="bg-purple-600" label="Elite (10h+)" />
        <LegendItem color="bg-emerald-600" label="Target (8h+)" />
        <LegendItem color="bg-amber-600" label="Partial (4h+)" />
        <LegendItem color="bg-rose-600" label="Missed" />
      </section>

      {/* GRAPH SECTION WITH CUSTOM DATE PICKERS */}
      <section className="space-y-6 pt-10 border-t border-slate-800">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-2">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-blue-500" size={24} />
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">
                Operational Trajectory
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Custom Range Analysis
              </p>
            </div>
          </div>

          {/* Replace the Graph Filter section with this refined version */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/80 p-4 rounded-[2rem] border border-slate-800 backdrop-blur-md w-full lg:w-auto shadow-2xl">
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus-within:border-blue-500/50 transition-all w-full sm:w-auto">
              <CalendarDays size={16} className="text-blue-500" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="bg-transparent text-xs font-black uppercase text-white outline-none cursor-pointer w-full"
                style={{ colorScheme: "dark" }}
              />
            </div>

            <div className="text-slate-700 font-black text-[10px] hidden sm:block">
              TO
            </div>

            <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 focus-within:border-blue-500/50 transition-all w-full sm:w-auto">
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="bg-transparent text-xs font-black uppercase text-white outline-none cursor-pointer w-full"
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>
        </div>

        <div className="card h-[350px] md:h-[500px] bg-slate-900 border-2 border-slate-800 p-4 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={graphData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}h`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "900",
                }}
                itemStyle={{ color: "#60a5fa" }}
              />
              <ReferenceLine y={8} stroke="#10b981" strokeDasharray="5 5" />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#3b82f6"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorHours)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Watermark */}
          <div className="absolute bottom-6 right-8 pointer-events-none opacity-[0.03]">
            <Zap size={180} className="text-white -rotate-12" />
          </div>
        </div>
      </section>
    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-3 bg-slate-900/40 border border-slate-800 p-4 rounded-2xl shadow-inner">
    <div className={`w-3 h-3 rounded-full ${color} shadow-lg`} />
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
      {label}
    </span>
  </div>
);

export default CalendarView;
