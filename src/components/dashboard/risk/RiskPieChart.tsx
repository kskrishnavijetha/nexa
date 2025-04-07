
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { RiskCount } from './types';

interface RiskPieChartProps {
  riskData: RiskCount[];
  showLabels?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

const RiskPieChart: React.FC<RiskPieChartProps> = ({
  riskData,
  showLabels = false,
  innerRadius = 45,
  outerRadius = 60
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(undefined);
  };
  
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={riskData.filter(item => item.value > 0)}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          label={showLabels ? ({name, value}) => `${name}: ${value}` : undefined}
          labelLine={showLabels ? false : undefined}
        >
          {riskData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color} 
              stroke="none"
            />
          ))}
        </Pie>
        <Legend 
          layout={showLabels ? "horizontal" : "vertical"} 
          verticalAlign={showLabels ? "bottom" : "middle"} 
          align={showLabels ? "center" : "right"}
          formatter={(value) => <span className={`text-${showLabels ? 'sm' : 'xs'}`}>{value}</span>}
        />
        <Tooltip 
          formatter={(value) => [`${value} issues`, '']}
          contentStyle={{
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
            boxShadow: showLabels ? '0 2px 8px rgba(0, 0, 0, 0.15)' : undefined,
            borderColor: showLabels ? '#E5E7EB' : undefined
          }}
          labelStyle={{ display: 'none' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RiskPieChart;
