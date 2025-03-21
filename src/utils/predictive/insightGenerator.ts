
import { ComplianceReport } from '../types';
import { ComplianceInsight } from './types';
import { predictRisks } from './riskPredictor';

// Generate insights based on historical data and current report
export const generateInsights = (
  reports: ComplianceReport[]
): ComplianceInsight[] => {
  if (reports.length < 2) {
    return [{
      title: "Insufficient historical data",
      description: "More compliance scans are needed to generate meaningful insights.",
      actionRequired: false,
      priority: 'medium'
    }];
  }
  
  const insights: ComplianceInsight[] = [];
  
  // Sort reports by date
  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const latestReport = sortedReports[0];
  const previousReports = sortedReports.slice(1);
  
  // Analyze score trends
  const scoreFields = ['gdprScore', 'hipaaScore', 'soc2Score', 'pciDssScore', 'overallScore'] as const;
  
  scoreFields.forEach(field => {
    if (field === 'pciDssScore' && !latestReport[field]) return;
    
    const currentScore = latestReport[field] as number;
    const previousScores = previousReports
      .map(r => r[field] as number | undefined)
      .filter((score): score is number => score !== undefined);
    
    if (previousScores.length === 0) return;
    
    const avgPreviousScore = previousScores.reduce((sum, score) => sum + score, 0) / previousScores.length;
    const scoreDiff = currentScore - avgPreviousScore;
    
    if (Math.abs(scoreDiff) >= 5) {
      const fieldName = field.replace('Score', '').toUpperCase();
      
      if (scoreDiff <= -10) {
        insights.push({
          title: `Significant drop in ${fieldName} compliance`,
          description: `${fieldName} score has decreased by ${Math.abs(scoreDiff).toFixed(1)} points compared to historical average.`,
          actionRequired: true,
          priority: 'critical'
        });
      } else if (scoreDiff <= -5) {
        insights.push({
          title: `Declining ${fieldName} compliance`,
          description: `${fieldName} score has decreased by ${Math.abs(scoreDiff).toFixed(1)} points compared to historical average.`,
          actionRequired: true,
          priority: 'high'
        });
      } else if (scoreDiff >= 10) {
        insights.push({
          title: `Major improvement in ${fieldName} compliance`,
          description: `${fieldName} score has improved by ${scoreDiff.toFixed(1)} points compared to historical average.`,
          actionRequired: false,
          priority: 'low'
        });
      }
    }
  });
  
  // Analyze recurring risks
  const recurringRisks = predictRisks(reports).filter(risk => risk.probability > 50);
  
  if (recurringRisks.length > 0) {
    insights.push({
      title: `${recurringRisks.length} recurring compliance issues identified`,
      description: `Several risks appear in multiple compliance scans and may require systematic fixes.`,
      actionRequired: true,
      priority: 'medium'
    });
  }
  
  // If no insights were generated, add a positive default one
  if (insights.length === 0) {
    insights.push({
      title: "Consistent compliance maintained",
      description: "No significant compliance variations detected across scans.",
      actionRequired: false,
      priority: 'low'
    });
  }
  
  return insights;
};
