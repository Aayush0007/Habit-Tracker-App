import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  best: '#9333ea',    // Purple
  target: '#10b981',  // Emerald
  partial: '#f59e0b', // Amber
  missed: '#f43f5e',  // Rose
  none: '#1e293b'     // Slate
};

const ConsistencyChart = ({ data }) => {
  // Calculate total sessions for the legend/center display if needed
  const total = data.reduce((acc, entry) => acc + entry.value, 0);

  return (
    <div className="h-[320px] w-full bg-slate-900/50 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl relative min-w-0">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Distribution Analysis</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={10}
            dataKey="value"
            stroke="none"
            animationBegin={0}
            animationDuration={1200}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.none} className="hover:opacity-80 transition-opacity" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
            itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
            cursor={{ fill: 'transparent' }}
          />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            formatter={(value) => (
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Central Identity Stat */}
      <div className="absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">Total</p>
        <p className="text-xl font-black text-white italic">{total}</p>
      </div>
    </div>
  );
};

export default ConsistencyChart;