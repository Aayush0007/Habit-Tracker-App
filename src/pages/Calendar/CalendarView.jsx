import React, { useState, useEffect } from 'react';
import { initDB } from '../../db/indexedDB/dbConfig';
import { getDaysInMonth, getFirstDayOfMonth, getStatusColor } from '../../utils/calendarUtils';

const CalendarView = () => {
  const [logs, setLogs] = useState({});
  
  // Hardcoded to January 2026 for your specific exam focus
  const displayMonth = 0; // January is 0 in JS
  const displayYear = 2026;
  
  const days = getDaysInMonth(displayMonth, displayYear);
  const firstDay = getFirstDayOfMonth(displayMonth, displayYear);

  useEffect(() => {
    const fetchMonthData = async () => {
      try {
        const db = await initDB();
        const allLogs = await db.getAll('daily_logs');
        const logMap = {};
        allLogs.forEach(log => {
          logMap[log.date] = log.dayStatus;
        });
        setLogs(logMap);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };
    fetchMonthData();
  }, []);

  // Create the grid: placeholders for empty days + the actual days of the month
  const calendarGrid = Array(firstDay).fill(null).concat([...Array(days).keys()]);

  return (
    <div className="p-6 space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight">Consistency Map</h1>
        <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest">January 2026</p>
      </header>

      <div className="card p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        {/* Days Header - Fixed unique key error */}
        <div className="grid grid-cols-7 mb-4">
          {['S','M','T','W','T','F','S'].map((d, index) => (
            <div 
              key={`header-${d}-${index}`} 
              className="text-center text-[10px] font-black text-slate-600 uppercase"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid - Fixed unique key error */}
        <div className="grid grid-cols-7 gap-3">
          {calendarGrid.map((day, index) => {
            const key = `grid-cell-${index}`;
            
            if (day === null) {
              return <div key={key} className="w-8 h-8" />;
            }
            
            const dayNum = day + 1;
            const dateStr = `2026-01-${String(dayNum).padStart(2, '0')}`;
            const status = logs[dateStr] || 'none';

            return (
              <div key={key} className="flex flex-col items-center justify-center">
                <div 
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold transition-all duration-300 border ${
                    status === 'none' 
                      ? 'bg-slate-800 border-slate-700 text-slate-500' 
                      : `${getStatusColor(status)} border-transparent text-white shadow-lg`
                  }`}
                >
                  {dayNum}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend Section */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Status Legend</h3>
        <div className="grid grid-cols-2 gap-3">
          <LegendItem color="bg-purple-500" label="Best Day (10h+)" />
          <LegendItem color="bg-emerald-500" label="Target Met (8h+)" />
          <LegendItem color="bg-amber-500" label="Partial Day (6h+)" />
          <LegendItem color="bg-rose-500" label="Missed Day" />
          <LegendItem color="bg-slate-500" label="Recovery Day" />
          <LegendItem color="bg-slate-800" label="No Entry" />
        </div>
      </div>
    </div>
  );
};

// Sub-component for Legend to keep code clean
const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
    <div className={`w-3 h-3 rounded-full ${color}`} />
    <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{label}</span>
  </div>
);

export default CalendarView;