import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';

const ConsistencyChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie dataKey="value" data={data} fill="#8884d8" />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ConsistencyChart;