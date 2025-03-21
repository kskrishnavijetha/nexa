
import { ComplianceReport } from '../types';
import { RiskPrediction } from './types';

// Generate recommendations based on predicted risks and insights
export const generateRecommendations = (
  predictedRisks: RiskPrediction[],
  reports: ComplianceReport[]
) => {
  const recommendations = [
    // Default recommendations
    {
      title: "Regular compliance training",
      description: "Implement quarterly compliance training sessions for all staff to maintain awareness of current regulations.",
      impact: "medium" as const,
      effortToImplement: "medium" as const
    }
  ];
  
  // Add recommendations based on predicted risks
  const highProbabilityRisks = predictedRisks.filter(risk => risk.probability > 60);
  
  highProbabilityRisks.forEach(risk => {
    if (risk.severity === 'high') {
      recommendations.push({
        title: `Address ${risk.regulation} compliance gap`,
        description: `Develop a remediation plan for "${risk.riskType}" which has a ${risk.probability}% likelihood of occurring in future assessments.`,
        impact: "medium" as const,
        effortToImplement: "medium" as const
      });
    }
  });
  
  // Add recommendations for industry-specific issues
  const industryRisks = predictedRisks.filter(risk => 
    !['GDPR', 'HIPAA', 'SOC 2', 'PCI-DSS'].includes(risk.regulation)
  );
  
  if (industryRisks.length > 0) {
    recommendations.push({
      title: "Industry-specific compliance review",
      description: `Schedule a dedicated review of ${industryRisks[0].regulation} compliance requirements with subject matter experts.`,
      impact: "medium" as const,
      effortToImplement: "medium" as const
    });
  }
  
  // Analyze trends and add recommendations
  if (reports.length >= 3) {
    const sortedReports = [...reports].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    const recentReports = sortedReports.slice(0, 3);
    const overallScores = recentReports.map(r => r.overallScore);
    
    if (overallScores.every((score, i, arr) => i === 0 || score <= arr[i-1])) {
      recommendations.push({
        title: "Comprehensive compliance program review",
        description: "Your compliance scores show a consistent downward trend. Consider a full review of your compliance program.",
        impact: "medium" as const,
        effortToImplement: "medium" as const
      });
    }
  }
  
  return recommendations;
};
