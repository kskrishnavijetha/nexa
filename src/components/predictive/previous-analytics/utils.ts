
import { ComplianceReport } from '@/utils/types';
import { PredictiveAnalyticsResult, ComplianceInsight } from '@/utils/predictive/types';

// Prepares data for trend comparison chart
export const prepareScoreTrendData = (
  historicalReports: ComplianceReport[],
  previousResults: PredictiveAnalyticsResult[],
  currentResult: PredictiveAnalyticsResult,
  selectedMetric: string
) => {
  const dataPoints = [];
  
  // Add historical data points
  historicalReports.slice().reverse().forEach((report, index) => {
    if (index < 5) { // Limit to 5 points
      const previousResult = previousResults.find(
        pr => pr.lastUpdated && new Date(pr.lastUpdated).getTime() - new Date(report.timestamp).getTime() < 86400000
      );
      
      if (previousResult) {
        let score = 0;
        // Type assertion to ensure we're working with a ComplianceReport
        if (selectedMetric === 'gdpr') score = report.gdprScore;
        else if (selectedMetric === 'hipaa') score = report.hipaaScore;
        else if (selectedMetric === 'soc2') score = report.soc2Score;
        else if (selectedMetric === 'overall') score = report.overallScore;
        
        dataPoints.push({
          name: formatDate(report.timestamp),
          score: score,
          predictedScore: getAverageScoreFromTrends(previousResult.riskTrends, selectedMetric)
        });
      }
    }
  });
  
  // Add current data point
  const currentReport = historicalReports[0];
  if (currentReport) {
    let currentScore = 0;
    if (selectedMetric === 'gdpr') currentScore = currentReport.gdprScore;
    else if (selectedMetric === 'hipaa') currentScore = currentReport.hipaaScore;
    else if (selectedMetric === 'soc2') currentScore = currentReport.soc2Score;
    else if (selectedMetric === 'overall') currentScore = currentReport.overallScore;
    
    dataPoints.push({
      name: 'Current',
      score: currentScore,
      predictedScore: getAverageScoreFromTrends(currentResult.riskTrends, selectedMetric)
    });
  }
  
  return dataPoints;
};

// Get average score from risk trends for a specific regulation
export const getAverageScoreFromTrends = (trends: any[], metricType: string) => {
  if (!trends || trends.length === 0) return 0;
  
  const relevantTrends = trends.filter(trend => {
    if (metricType === 'gdpr') return trend.regulation === 'GDPR';
    if (metricType === 'hipaa') return trend.regulation === 'HIPAA';
    if (metricType === 'soc2') return trend.regulation === 'SOC 2';
    if (metricType === 'overall') return true;
    return false;
  });
  
  if (relevantTrends.length === 0) return 0;
  
  return relevantTrends.reduce((sum, trend) => sum + trend.predictedScore, 0) / relevantTrends.length;
};

// Compare predictions accuracy
export const compareInsightAccuracy = (
  previousResults: PredictiveAnalyticsResult[],
  historicalReports: ComplianceReport[]
) => {
  // Get most recent previous result for comparison
  const mostRecentPreviousResult = previousResults[0];
  if (!mostRecentPreviousResult) return [];
  
  // Compare previous predictions with current reality
  const comparisonItems = [];
  const previousTrends = mostRecentPreviousResult.riskTrends;
  
  previousTrends.forEach(prevTrend => {
    const currentReport = historicalReports[0];
    if (currentReport) {
      let actualScore = 0;
      if (prevTrend.regulation === 'GDPR') actualScore = currentReport.gdprScore;
      else if (prevTrend.regulation === 'HIPAA') actualScore = currentReport.hipaaScore;
      else if (prevTrend.regulation === 'SOC 2') actualScore = currentReport.soc2Score;
      
      if (actualScore > 0) {
        const predictedScore = prevTrend.predictedScore;
        const difference = Math.abs(actualScore - predictedScore);
        const accuracy = 100 - Math.min(difference, 100);
        
        comparisonItems.push({
          regulation: prevTrend.regulation,
          predictedScore: predictedScore,
          actualScore: actualScore,
          accuracy: accuracy
        });
      }
    }
  });
  
  return comparisonItems;
};

// Format date for display
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
