import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const StudyBarChart = ({ data, title = "Temporal Focus Analysis" }) => {
  return (
    <div className="card bg-slate-900/50 border-2 border-slate-800 p-6 rounded-3xl shadow-2xl h-[350px] min-w-0">
      <div className="flex justify-between items-center mb-8 px-2">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{title}</h3>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#475569', fontSize: 10 }} 
          />
          <Tooltip 
            cursor={{ fill: '#1e293b', opacity: 0.3 }}
            contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
            itemStyle={{ fontWeight: 'bold', textTransform: 'uppercase' }}
          />
          <Bar dataKey="hours" radius={[6, 6, 2, 2]} barSize={24}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.hours >= 8 ? '#10b981' : '#3b82f6'} 
                className="hover:opacity-80 transition-all duration-300"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudyBarChart;