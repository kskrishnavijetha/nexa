
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ComplianceScore = () => {
  // Mock data for the compliance score chart
  const data = [
    { month: 'Nov', score: 62 },
    { month: 'Dec', score: 68 },
    { month: 'Jan', score: 72 },
    { month: 'Feb', score: 70 },
    { month: 'Mar', score: 76 },
    { month: 'Apr', score: 78 }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={false}
        />
        <YAxis 
          domain={[40, 100]}
          tick={{ fontSize: 12 }} 
          axisLine={{ stroke: '#E5E7EB' }}
          tickLine={false}
          tickCount={6}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '4px', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            borderColor: '#E5E7EB'
          }} 
          formatter={(value) => [`${value}%`, 'Compliance Score']}
          labelStyle={{ fontWeight: 600 }}
        />
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke="#2563EB" 
          strokeWidth={2}
          dot={{ strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ComplianceScore;
