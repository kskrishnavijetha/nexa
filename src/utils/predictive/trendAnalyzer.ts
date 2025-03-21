
import { ComplianceReport } from '../types';

// Generate risk trends based on historical data
export const generateRiskTrends = (reports: ComplianceReport[]) => {
  if (reports.length < 2) {
    return [];
  }
  
  // Sort reports by date (newest first)
  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const latestReport = sortedReports[0];
  const previousReports = sortedReports.slice(1, 4); // Use up to 3 previous reports
  
  // Aggregate previous scores by regulation
  const regulations = new Set<string>();
  reports.forEach(report => {
    if (report.regulations) {
      report.regulations.forEach(reg => regulations.add(reg));
    }
  });
  
  // Core regulations to always include
  ['GDPR', 'HIPAA', 'SOC 2', 'PCI-DSS'].forEach(reg => regulations.add(reg));
  
  return Array.from(regulations).map(regulation => {
    // Get current score
    let currentScore = 0;
    if (regulation === 'GDPR') currentScore = latestReport.gdprScore;
    else if (regulation === 'HIPAA') currentScore = latestReport.hipaaScore;
    else if (regulation === 'SOC 2') currentScore = latestReport.soc2Score;
    else if (regulation === 'PCI-DSS') currentScore = latestReport.pciDssScore || 0;
    else if (latestReport.industryScores && latestReport.industryScores[regulation]) {
      currentScore = latestReport.industryScores[regulation];
    }
    
    // Calculate previous average score
    let previousScoreSum = 0;
    let previousScoreCount = 0;
    
    previousReports.forEach(report => {
      let score = 0;
      if (regulation === 'GDPR') score = report.gdprScore;
      else if (regulation === 'HIPAA') score = report.hipaaScore;
      else if (regulation === 'SOC 2') score = report.soc2Score;
      else if (regulation === 'PCI-DSS') score = report.pciDssScore || 0;
      else if (report.industryScores && report.industryScores[regulation]) {
        score = report.industryScores[regulation];
      }
      
      if (score > 0) {
        previousScoreSum += score;
        previousScoreCount += 1;
      }
    });
    
    const previousScore = previousScoreCount > 0 
      ? previousScoreSum / previousScoreCount 
      : currentScore;
    
    // Determine trend
    const scoreDiff = currentScore - previousScore;
    let trend: 'increasing' | 'stable' | 'decreasing';
    
    if (Math.abs(scoreDiff) < 3) {
      trend = 'stable';
    } else if (scoreDiff > 0) {
      trend = 'increasing';
    } else {
      trend = 'decreasing';
    }
    
    return {
      regulation,
      previousScore: Math.round(previousScore),
      predictedScore: Math.round(currentScore + (scoreDiff / 2)), // Simple prediction
      trend
    };
  });
};
