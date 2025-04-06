
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const RiskSummary = () => {
  // Mock data for the risk pie chart
  const data = [
    { name: 'High Risk', value: 3, color: '#EF4444' },
    { name: 'Medium Risk', value: 8, color: '#F59E0B' },
    { name: 'Low Risk', value: 14, color: '#10B981' },
  ];
  
  const COLORS = ['#EF4444', '#F59E0B', '#10B981'];
  
  return (
    <div className="relative h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} issues`, name]}
            contentStyle={{
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              borderColor: '#E5E7EB'
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskSummary;
