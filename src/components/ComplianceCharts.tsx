
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceReport, RiskItem } from '@/utils/types';

interface ComplianceChartsProps {
  report: ComplianceReport;
}

const ComplianceCharts: React.FC<ComplianceChartsProps> = ({ report }) => {
  // Prepare data for compliance scores bar chart
  const barChartData = [
    { name: 'Overall', score: report.overallScore, fill: '#6366f1' },
    { name: 'GDPR', score: report.gdprScore, fill: '#3b82f6' },
    { name: 'HIPAA', score: report.hipaaScore, fill: '#0ea5e9' },
    { name: 'SOC 2', score: report.soc2Score, fill: '#06b6d4' },
  ];

  // Add PCI-DSS score if available
  if (report.pciDssScore) {
    barChartData.push({ name: 'PCI-DSS', score: report.pciDssScore, fill: '#0284c7' });
  }

  // Add industry-specific scores if available
  if (report.industryScores) {
    Object.entries(report.industryScores).forEach(([regulation, score], index) => {
      const colors = ['#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#c026d3', '#db2777'];
      barChartData.push({ 
        name: regulation.length > 10 ? regulation.substring(0, 10) + '...' : regulation, 
        score, 
        fill: colors[index % colors.length] 
      });
    });
  }

  // Prepare data for risk distribution pie chart
  const calculateRiskDistribution = (risks: RiskItem[]) => {
    const counts: Record<string, number> = { high: 0, medium: 0, low: 0 };
    risks.forEach(risk => {
      counts[risk.severity] += 1;
    });
    
    return [
      { name: 'High', value: counts.high, fill: '#ef4444' },
      { name: 'Medium', value: counts.medium, fill: '#f59e0b' },
      { name: 'Low', value: counts.low, fill: '#10b981' }
    ].filter(item => item.value > 0);
  };
  
  const pieChartData = calculateRiskDistribution(report.risks);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Compliance Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Issues']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground text-center">No risks found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceCharts;
