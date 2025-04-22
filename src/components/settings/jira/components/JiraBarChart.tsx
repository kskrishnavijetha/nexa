
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FrameworkData {
  name: string;
  complete: number;
  incomplete: number;
}

interface JiraBarChartProps {
  data: FrameworkData[];
}

const JiraBarChart: React.FC<JiraBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="complete" name="Compliant" fill="#10b981" />
        <Bar dataKey="incomplete" name="Non-compliant" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default JiraBarChart;
