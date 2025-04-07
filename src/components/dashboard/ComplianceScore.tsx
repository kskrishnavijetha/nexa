
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getUserHistoricalReports } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { getScoreColor } from '@/utils/scoreService';

const ComplianceScore = () => {
  const { user } = useAuth();
  const [scoreData, setScoreData] = useState<{ month: string; score: number }[]>([]);
  
  useEffect(() => {
    const generateScoreData = () => {
      if (user?.id) {
        const userReports = getUserHistoricalReports(user.id);
        
        if (userReports.length > 0) {
          // Group reports by month and calculate average score per month
          const monthlyScores: { [key: string]: { total: number; count: number } } = {};
          
          userReports.forEach((report) => {
            if (report.timestamp) {
              const date = new Date(report.timestamp);
              const monthKey = date.toLocaleString('default', { month: 'short' });
              
              if (!monthlyScores[monthKey]) {
                monthlyScores[monthKey] = { total: 0, count: 0 };
              }
              
              monthlyScores[monthKey].total += report.overallScore;
              monthlyScores[monthKey].count += 1;
            }
          });
          
          // Convert to chart data format
          const chartData = Object.keys(monthlyScores).map(month => ({
            month,
            score: Math.round(monthlyScores[month].total / monthlyScores[month].count)
          }));
          
          // Sort by month (this is a simplified approach)
          const monthOrder: { [key: string]: number } = {
            'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
            'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
          };
          
          chartData.sort((a, b) => (monthOrder[a.month] || 0) - (monthOrder[b.month] || 0));
          setScoreData(chartData);
        }
      }
    };
    
    generateScoreData();
  }, [user]);

  if (scoreData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">No compliance data available</p>
        <p className="text-xs text-muted-foreground mt-1">Run document scans to see your compliance score trend</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="text-xl font-bold text-center mb-0">Compliance Score</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">Your compliance score over time</p>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={scoreData}
            margin={{
              top: 10,
              right: 20,
              left: 10,
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
              tickCount={5}
              ticks={[40, 55, 70, 85, 100]}
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
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6, stroke: 'white' }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComplianceScore;
