import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { getDaysInMonth, getFirstDayOfMonth, getStatusColor } from '../../utils/calendarUtils';
import { calculateStudyStatus } from '../../features/studySessions/sessionLogic';
import { Calendar as CalendarIcon, Zap, ShieldCheck, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = () => {
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Default to Jan 2026

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const days = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const todayDateStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchMonthData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate date range for the current view
      const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const end = `${year}-${String(month + 1).padStart(2, '0')}-${days}`;

      const { data: sessions } = await supabase
        .from('study_sessions')
        .select('date, status')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('date', start)
        .lte('date', end);

      const dayMap = {};
      sessions?.forEach(session => {
        dayMap[session.date] = (dayMap[session.date] || 0) + 2; 
      });

      const statusMap = {};
      Object.entries(dayMap).forEach(([date, totalHours]) => {
        // Updated to use the 'code' property from your logic
        statusMap[date] = calculateStudyStatus(totalHours).label.split(' ')[0].toLowerCase();
      });

      setLogs(statusMap);
      setLoading(false);
    };
    fetchMonthData();
  }, [currentDate, month, year, days]);

  const changeMonth = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const calendarGrid = Array(firstDay).fill(null).concat([...Array(days).keys()]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
      <Loader2 className="text-blue-500 animate-spin mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Retrieving Timeline</p>
    </div>
  );

  return (
    <div className="p-6 space-y-8 pb-24 max-w-lg mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="text-blue-500" size={18} />
            <h1 className="text-3xl font-black italic text-white tracking-tighter uppercase">Consistency Map</h1>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">
            Deployment: {currentDate.toLocaleString('default', { month: 'long' })} {year}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => changeMonth(-1)} className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:text-blue-400 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => changeMonth(1)} className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:text-blue-400 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className="card p-6 bg-slate-900/50 border-2 border-slate-800 rounded-[2rem] shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-7 mb-6">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-black text-slate-700 uppercase">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {calendarGrid.map((day, index) => {
            if (day === null) return <div key={`empty-${index}`} />;
            
            const dayNum = day + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const status = logs[dateStr] || 'none';
            const isToday = dateStr === todayDateStr;

            return (
              <div key={dateStr} className="flex justify-center relative">
                <div 
                  className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center text-[11px] font-black transition-all duration-500 border-2
                  ${getStatusColor(status)} 
                  ${isToday ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950 scale-110 z-10' : ''}`}
                >
                  {dayNum}
                  {isToday && (
                    <span className="absolute -bottom-1.5 text-[6px] font-black text-blue-400 tracking-tighter animate-pulse">LIVE</span>
                  )}
                </div>
                {status !== 'none' && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border-2 border-slate-950 z-20" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-slate-500" />
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment Codes</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <LegendItem color="bg-purple-600" label="Elite (10h+)" icon={<Zap size={10} />} />
          <LegendItem color="bg-emerald-600" label="Target (8h+)" />
          <LegendItem color="bg-amber-600" label="Partial (4h+)" />
          <LegendItem color="bg-rose-600" label="Missed" />
        </div>
      </section>
    </div>
  );
};

const LegendItem = ({ color, label, icon }) => (
  <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 p-3 rounded-2xl">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
    </div>
    {icon && <span className="text-purple-400">{icon}</span>}
  </div>
);

export default CalendarView;