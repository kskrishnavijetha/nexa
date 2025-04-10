
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceReport, ComplianceRisk } from '@/utils/types';

interface ComplianceChartsProps {
  report: ComplianceReport;
}

const ComplianceCharts: React.FC<ComplianceChartsProps> = ({ report }) => {
  // Prepare data for compliance scores bar chart - limit to 6 most important scores
  const prepareBarChartData = () => {
    const data = [
      { name: 'Overall', score: report.overallScore, fill: '#6366f1' },
    ];
    
    // Add most important standard scores
    if (report.gdprScore !== undefined) data.push({ name: 'GDPR', score: report.gdprScore, fill: '#3b82f6' });
    if (report.hipaaScore !== undefined && report.hipaaScore > 0) data.push({ name: 'HIPAA', score: report.hipaaScore, fill: '#0ea5e9' });
    if (report.soc2Score !== undefined && report.soc2Score > 0) data.push({ name: 'SOC 2', score: report.soc2Score, fill: '#06b6d4' });
    if (report.pciDssScore !== undefined && report.pciDssScore > 0) data.push({ name: 'PCI', score: report.pciDssScore, fill: '#0284c7' });

    // Add limited industry-specific scores if available
    if (report.industryScores) {
      const colors = ['#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#c026d3'];
      
      // Get only the first 2 industry scores to avoid performance issues
      Object.entries(report.industryScores).slice(0, 2).forEach(([regulation, score], index) => {
        const shortName = regulation.length > 8 ? regulation.substring(0, 8) + '...' : regulation;
        data.push({ 
          name: shortName, 
          score: score as number, 
          fill: colors[index % colors.length] 
        });
      });
    }
    
    return data;
  };
  
  const barChartData = prepareBarChartData();

  // Prepare data for risk distribution pie chart
  const calculateRiskDistribution = (risks: ComplianceRisk[]) => {
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
  
  // Limit the number of risks processed to improve performance
  const limitedRisks = report.risks.length > 50 ? report.risks.slice(0, 50) : report.risks;
  const pieChartData = calculateRiskDistribution(limitedRisks);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 compliance-charts-container">
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
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.7} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} cursor={{ fill: 'transparent' }} />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" isAnimationActive={false} />
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
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    isAnimationActive={false}
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
