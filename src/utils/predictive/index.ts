
import { ComplianceReport } from '../types';
import { PredictiveAnalyticsResult } from './types';
import { predictRisks } from './riskPredictor';
import { generateInsights } from './insightGenerator';
import { generateRiskTrends } from './trendAnalyzer';
import { generateRecommendations } from './recommendationEngine';
import { generateSyntheticReports } from './syntheticDataGenerator';

// Main function to analyze reports and generate predictive analytics
export const analyzePastReports = async (
  currentReport: ComplianceReport,
  historicalReports: ComplianceReport[] = []
): Promise<PredictiveAnalyticsResult> => {
  // In a real implementation, we might fetch historical data here
  const allReports = [currentReport, ...historicalReports];
  
  // If we don't have enough data, use simulated historical data
  if (allReports.length < 3) {
    // Generate some synthetic historical reports based on the current report
    const syntheticReports = generateSyntheticReports(currentReport);
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

// Re-export types
export * from './types';
