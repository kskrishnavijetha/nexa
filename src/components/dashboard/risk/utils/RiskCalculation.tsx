
import { ComplianceRisk, ComplianceReport } from '@/utils/types';
import { RiskCount, RiskCategory } from '../types';

// Calculate risk data from a report or multiple reports
export const calculateRiskDistribution = (
  selectedReport: ComplianceReport | null,
  allReports: ComplianceReport[] | null
) => {
  // Default risk data
  let riskData: RiskCount[] = [
    { name: 'High Risk', value: 0, color: '#EF4444' },
    { name: 'Medium Risk', value: 0, color: '#F59E0B' },
    { name: 'Low Risk', value: 0, color: '#10B981' },
  ];
  
  let categoryData: RiskCategory[] = [];
  let risks: ComplianceRisk[] = [];
  
  if (selectedReport) {
    // Use the selected report's risks
    const reportRisks = selectedReport.risks;
    
    // Count risks by severity
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    
    // Create a map to count risks by regulation (category)
    const categoryMap: Record<string, number> = {};
    
    reportRisks.forEach(risk => {
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
      riskData = [
        { name: 'High Risk', value: highCount, color: '#EF4444' },
        { name: 'Medium Risk', value: mediumCount, color: '#F59E0B' },
        { name: 'Low Risk', value: lowCount, color: '#10B981' },
      ];
      
      // Create category data array from the map
      const categoryColors = ['#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16', '#06B6D4'];
      const categories = Object.entries(categoryMap).map(([category, count], index) => ({
        category,
        count,
        color: categoryColors[index % categoryColors.length]
      }));
      
      categoryData = categories;
    }
    
    // Set risks for display
    risks = reportRisks;
  } else if (allReports && allReports.length > 0) {
    // If no specific report is selected, use all reports
    // Count risks by severity across all reports
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    
    // Create a map to count risks by regulation (category)
    const categoryMap: Record<string, number> = {};
    
    allReports.forEach(report => {
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
      riskData = [
        { name: 'High Risk', value: highCount, color: '#EF4444' },
        { name: 'Medium Risk', value: mediumCount, color: '#F59E0B' },
        { name: 'Low Risk', value: lowCount, color: '#10B981' },
      ];
      
      // Create category data array from the map
      const categoryColors = ['#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16', '#06B6D4'];
      const categories = Object.entries(categoryMap).map(([category, count], index) => ({
        category,
        count,
        color: categoryColors[index % categoryColors.length]
      })).sort((a, b) => b.count - a.count);
      
      categoryData = categories;
    }
    
    // Combine all risks from all reports for the table view
    const allRisks = allReports.flatMap(report => report.risks);
    
    // Sort by severity (high first)
    const sortedRisks = allRisks.sort((a, b) => {
      const severityValue = { high: 3, medium: 2, low: 1 };
      return (severityValue[b.severity as keyof typeof severityValue] || 0) - 
              (severityValue[a.severity as keyof typeof severityValue] || 0);
    });
    
    // Limit to top 5 risks
    risks = sortedRisks.slice(0, 5);
  }

  return { riskData, categoryData, risks };
};
