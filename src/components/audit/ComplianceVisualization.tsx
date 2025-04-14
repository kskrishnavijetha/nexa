
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ComplianceVisualizationProps {
  className?: string;
  documentName: string;
  auditEvents: any[];
}

const ComplianceVisualization: React.FC<ComplianceVisualizationProps> = ({ 
  className,
  documentName,
  auditEvents
}) => {
  // Calculate mock risk distribution
  const totalEvents = auditEvents.length;
  const highRisk = Math.round(totalEvents * 0.15);
  const mediumRisk = Math.round(totalEvents * 0.35);
  const lowRisk = totalEvents - highRisk - mediumRisk;
  
  const riskData = [
    { name: 'High', value: highRisk, color: '#dc3545' },
    { name: 'Medium', value: mediumRisk, color: '#ffc107' },
    { name: 'Low', value: lowRisk, color: '#28a745' }
  ];
  
  // Generate mock compliance scores for different regulations
  const complianceData = [
    { name: 'Overall', score: Math.round(75 + Math.random() * 20), color: '#2563eb' },
    { name: 'GDPR', score: Math.round(70 + Math.random() * 25), color: '#3b82f6' },
    { name: 'HIPAA', score: Math.round(75 + Math.random() * 20), color: '#0ea5e9' },
    { name: 'SOC2', score: Math.round(65 + Math.random() * 30), color: '#06b6d4' },
    { name: 'PCI-DSS', score: Math.round(70 + Math.random() * 25), color: '#0284c7' }
  ];
  
  return (
    <div className={`audit-chart ${className || ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} issues`, 'Count']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Compliance Scores</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{}}>
              <BarChart
                data={complianceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value) => [`${value}%`, 'Score']} />}
                />
                <Legend />
                <Bar dataKey="score">
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplianceVisualization;
