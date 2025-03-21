import { ComplianceReport, RiskItem, Industry } from './types';

type RiskPrediction = {
  riskType: string;
  probability: number;
  regulation: string;
  severity: 'high' | 'medium' | 'low';
  trend: 'increasing' | 'stable' | 'decreasing';
};

type ComplianceInsight = {
  title: string;
  description: string;
  actionRequired: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
};

export type PredictiveAnalyticsResult = {
  predictedRisks: RiskPrediction[];
  complianceInsights: ComplianceInsight[];
  riskTrends: {
    regulation: string;
    previousScore: number;
    predictedScore: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  }[];
  recommendations: {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effortToImplement: 'high' | 'medium' | 'low';
  }[];
  lastUpdated: string;
};

// Mock data for historical scans - in a real implementation, this would come from an API or database
const mockHistoricalScans: ComplianceReport[] = [
  // Historical scan data would be fetched from an API in a real implementation
  // This is just mock data for demonstration purposes
];

// Simple ML model that predicts risks based on historical data
const predictRisks = (
  reports: ComplianceReport[], 
  industry?: Industry
): RiskPrediction[] => {
  // In a real implementation, this would use actual ML algorithms
  // For now, we'll use a simplified approach based on frequency analysis
  
  // Extract all risks from historical reports
  const allRisks: RiskItem[] = reports.flatMap(report => report.risks);
  
  // Count occurrences of each risk by description
  const riskCounts: Record<string, { count: number, items: RiskItem[] }> = {};
  
  allRisks.forEach(risk => {
    const key = `${risk.description}-${risk.regulation}`;
    if (!riskCounts[key]) {
      riskCounts[key] = { count: 0, items: [] };
    }
    riskCounts[key].count += 1;
    riskCounts[key].items.push(risk);
  });
  
  // Convert to predictions sorted by frequency
  return Object.entries(riskCounts)
    .map(([key, { count, items }]) => {
      const risk = items[0]; // Use the first occurrence for details
      const totalReports = reports.length;
      const probability = (count / totalReports) * 100;
      
      // Determine trend based on recent reports
      const recentReports = reports.slice(0, Math.min(3, reports.length));
      const recentOccurrences = recentReports.filter(report => 
        report.risks.some(r => r.description === risk.description && r.regulation === risk.regulation)
      ).length;
      
      let trend: 'increasing' | 'stable' | 'decreasing';
      if (recentOccurrences > (recentReports.length / 2)) {
        trend = 'increasing';
      } else if (recentOccurrences === 0) {
        trend = 'decreasing';
      } else {
        trend = 'stable';
      }
      
      return {
        riskType: risk.description,
        probability: Math.min(Math.round(probability), 100),
        regulation: risk.regulation,
        severity: risk.severity,
        trend
      };
    })
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 8); // Return top 8 risks
};

// Generate insights based on historical data and current report
const generateInsights = (
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

// Generate risk trends based on historical data
const generateRiskTrends = (reports: ComplianceReport[]) => {
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

// Generate recommendations based on predicted risks and insights
const generateRecommendations = (
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
        effortToImplement: "high" as const
      });
    }
  }
  
  return recommendations;
};

// Main function to analyze reports and generate predictive analytics
export const analyzePastReports = async (
  currentReport: ComplianceReport,
  historicalReports: ComplianceReport[] = []
): Promise<PredictiveAnalyticsResult> => {
  // In a real implementation, we might fetch historical data here
  const allReports = [currentReport, ...historicalReports, ...mockHistoricalScans];
  
  // If we don't have enough data, use simulated historical data
  if (allReports.length < 3) {
    // Generate some synthetic historical reports based on the current report
    const syntheticReports = Array(3).fill(0).map((_, i) => {
      const randomFactor = 0.9 + (Math.random() * 0.2); // between 0.9 and 1.1
      const timestamp = new Date();
      timestamp.setMonth(timestamp.getMonth() - (i + 1));
      
      return {
        ...JSON.parse(JSON.stringify(currentReport)), // Deep copy
        documentId: `synthetic-${i}`,
        timestamp: timestamp.toISOString(),
        overallScore: Math.min(100, Math.max(0, Math.round(currentReport.overallScore * randomFactor))),
        gdprScore: Math.min(100, Math.max(0, Math.round(currentReport.gdprScore * randomFactor))),
        hipaaScore: Math.min(100, Math.max(0, Math.round(currentReport.hipaaScore * randomFactor))),
        soc2Score: Math.min(100, Math.max(0, Math.round(currentReport.soc2Score * randomFactor))),
        pciDssScore: currentReport.pciDssScore 
          ? Math.min(100, Math.max(0, Math.round(currentReport.pciDssScore * randomFactor)))
          : undefined
      };
    });
    
    allReports.push(...syntheticReports);
  }
  
  // Generate the predictive analytics
  const predictedRisks = predictRisks(allReports, currentReport.industry);
  const complianceInsights = generateInsights(allReports);
  const riskTrends = generateRiskTrends(allReports);
  const recommendations = generateRecommendations(predictedRisks, allReports);
  
  return {
    predictedRisks,
    complianceInsights,
    riskTrends,
    recommendations,
    lastUpdated: new Date().toISOString()
  };
};
