
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { getUserHistoricalReports } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface RiskCount {
  name: string;
  value: number;
  color: string;
}

interface RiskCategory {
  category: string;
  count: number;
  color: string;
}

const RiskSummary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [riskData, setRiskData] = useState<RiskCount[]>([
    { name: 'High Risk', value: 0, color: '#EF4444' },
    { name: 'Medium Risk', value: 0, color: '#F59E0B' },
    { name: 'Low Risk', value: 0, color: '#10B981' },
  ]);
  
  const [categoryData, setCategoryData] = useState<RiskCategory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    const calculateRiskDistribution = () => {
      if (user?.id) {
        const userReports = getUserHistoricalReports(user.id);
        
        if (userReports.length > 0) {
          // Count risks by severity across all reports
          let highCount = 0;
          let mediumCount = 0;
          let lowCount = 0;
          
          // Create a map to count risks by regulation (category)
          const categoryMap: Record<string, number> = {};
          
          userReports.forEach(report => {
            report.risks.forEach(risk => {
              // Count by severity
              if (risk.severity === 'high') highCount++;
              else if (risk.severity === 'medium') mediumCount++;
              else lowCount++;
              
              // Count by regulation/category
              const category = risk.regulation || 'Other';
              categoryMap[category] = (categoryMap[category] || 0) + 1;
            });
          });
          
          // Only update state if we have at least one risk
          if (highCount + mediumCount + lowCount > 0) {
            setRiskData([
              { name: 'High Risk', value: highCount, color: '#EF4444' },
              { name: 'Medium Risk', value: mediumCount, color: '#F59E0B' },
              { name: 'Low Risk', value: lowCount, color: '#10B981' },
            ]);
            
            // Create category data array from the map
            const categoryColors = ['#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16', '#06B6D4'];
            const categories = Object.entries(categoryMap).map(([category, count], index) => ({
              category,
              count,
              color: categoryColors[index % categoryColors.length]
            }));
            
            setCategoryData(categories);
          }
        }
      }
    };
    
    calculateRiskDistribution();
  }, [user]);

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
  
  // Check if there's no actual risk data (all zeros)
  const hasRiskData = riskData.some(item => item.value > 0);
  
  return (
    <div className="h-[250px] flex flex-col">
      {hasRiskData ? (
        <div className="flex flex-col h-full">
          <div className="mb-3 text-sm text-center text-muted-foreground">
            Risk breakdown by severity and category
          </div>
          <div className="flex-1">
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
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {riskData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
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
          
          {categoryData.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-1 text-xs">
              {categoryData.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-2 h-2 mr-1 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.category}: {item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-muted-foreground">No risk data available yet</p>
          <p className="text-xs text-muted-foreground mt-2">Perform document scans to see your risk distribution</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => navigate('/document-analysis')}
          >
            Scan Documents
          </Button>
        </div>
      )}
    </div>
  );
};

export default RiskSummary;
