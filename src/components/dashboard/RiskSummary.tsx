
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { getUserHistoricalReports } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ComplianceReport, ComplianceRisk } from '@/utils/types';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

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

interface RiskSummaryProps {
  selectedReport?: ComplianceReport | null;
}

const RiskSummary = ({ selectedReport }: RiskSummaryProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [riskData, setRiskData] = useState<RiskCount[]>([
    { name: 'High Risk', value: 0, color: '#EF4444' },
    { name: 'Medium Risk', value: 0, color: '#F59E0B' },
    { name: 'Low Risk', value: 0, color: '#10B981' },
  ]);
  
  const [categoryData, setCategoryData] = useState<RiskCategory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [risks, setRisks] = useState<ComplianceRisk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const calculateRiskDistribution = () => {
      setLoading(true);
      
      if (selectedReport) {
        // Use the selected report's risks
        const risks = selectedReport.risks;
        
        // Count risks by severity
        let highCount = 0;
        let mediumCount = 0;
        let lowCount = 0;
        
        // Create a map to count risks by regulation (category)
        const categoryMap: Record<string, number> = {};
        
        risks.forEach(risk => {
          // Count by severity
          if (risk.severity === 'high') highCount++;
          else if (risk.severity === 'medium') mediumCount++;
          else lowCount++;
          
          // Count by regulation/category
          const category = risk.regulation || 'Other';
          categoryMap[category] = (categoryMap[category] || 0) + 1;
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
        
        // Set risks for display in the table
        setRisks(risks);
      } else if (user?.id) {
        // If no specific report is selected, use all reports
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
            })).sort((a, b) => b.count - a.count);
            
            setCategoryData(categories);
          }
          
          // Combine all risks from all reports for the table view
          const allRisks = userReports.flatMap(report => report.risks);
          
          // Sort by severity (high first)
          const sortedRisks = allRisks.sort((a, b) => {
            const severityValue = { high: 3, medium: 2, low: 1 };
            return (severityValue[b.severity as keyof typeof severityValue] || 0) - 
                   (severityValue[a.severity as keyof typeof severityValue] || 0);
          });
          
          // Limit to top 5 risks
          setRisks(sortedRisks.slice(0, 5));
        }
      }
      
      setLoading(false);
    };
    
    calculateRiskDistribution();
    
    // Set up a timer to periodically update the risk distribution
    const timer = setInterval(calculateRiskDistribution, 30000); // 30 seconds
    
    return () => clearInterval(timer);
  }, [user, selectedReport]);

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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Check if there's no actual risk data (all zeros)
  const hasRiskData = riskData.some(item => item.value > 0);
  
  return (
    <div className="h-full flex flex-col">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-center">
            <div className="h-32 w-32 mx-auto rounded-full bg-slate-200 mb-4"></div>
            <div className="h-4 w-24 mx-auto bg-slate-200 rounded"></div>
          </div>
        </div>
      ) : hasRiskData ? (
        selectedReport ? (
          <div className="flex flex-col h-full">
            <div className="mb-3 text-sm font-medium">
              Risk Summary for: {selectedReport.documentName}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <div className="h-[170px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskData.filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
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
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        formatter={(value) => <span className="text-xs">{value}</span>}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} issues`, '']}
                        contentStyle={{ backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                        labelStyle={{ display: 'none' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {categoryData.length > 0 && (
                  <div className="grid grid-cols-2 gap-1 text-xs mt-2">
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
              
              <div className="overflow-hidden">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">Severity</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead className="w-24">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {risks.slice(0, 3).map((risk, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center">
                            {getSeverityIcon(risk.severity)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium truncate max-w-[180px]">
                          {risk.description}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => navigate('/history?document=' + encodeURIComponent(selectedReport.documentName))}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="mb-3 text-sm font-medium text-center">
              Overall Risk Distribution
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData.filter(item => item.value > 0)}
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
                    label={({name, value}) => `${name}: ${value}`}
                    labelLine={false}
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

            {risks.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Top Risks:</h4>
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">Severity</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead className="w-24">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {risks.slice(0, 3).map((risk, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center">
                            {getSeverityIcon(risk.severity)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium truncate max-w-[180px]">
                          {risk.description}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => navigate('/history')}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )
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
