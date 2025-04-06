
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getUserHistoricalReports } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';

interface RiskCount {
  name: string;
  value: number;
  color: string;
}

const RiskSummary = () => {
  const { user } = useAuth();
  const [riskData, setRiskData] = useState<RiskCount[]>([
    { name: 'High Risk', value: 0, color: '#EF4444' },
    { name: 'Medium Risk', value: 0, color: '#F59E0B' },
    { name: 'Low Risk', value: 0, color: '#10B981' },
  ]);
  
  useEffect(() => {
    const calculateRiskDistribution = () => {
      if (user?.id) {
        const userReports = getUserHistoricalReports(user.id);
        
        if (userReports.length > 0) {
          // Count risks by severity across all reports
          let highCount = 0;
          let mediumCount = 0;
          let lowCount = 0;
          
          userReports.forEach(report => {
            report.risks.forEach(risk => {
              if (risk.severity === 'high') highCount++;
              else if (risk.severity === 'medium') mediumCount++;
              else lowCount++;
            });
          });
          
          // Only update state if we have at least one risk
          if (highCount + mediumCount + lowCount > 0) {
            setRiskData([
              { name: 'High Risk', value: highCount, color: '#EF4444' },
              { name: 'Medium Risk', value: mediumCount, color: '#F59E0B' },
              { name: 'Low Risk', value: lowCount, color: '#10B981' },
            ]);
          }
        }
      }
    };
    
    calculateRiskDistribution();
  }, [user]);

  const COLORS = ['#EF4444', '#F59E0B', '#10B981'];
  
  // Check if there's no actual risk data (all zeros)
  const hasRiskData = riskData.some(item => item.value > 0);
  
  return (
    <div className="relative h-[250px]">
      {hasRiskData ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {riskData.map((entry, index) => (
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
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-muted-foreground">No risk data available yet</p>
          <p className="text-xs text-muted-foreground mt-2">Perform document scans to see your risk distribution</p>
        </div>
      )}
    </div>
  );
};

export default RiskSummary;
