
import { RiskItem, RiskSeverity, SimulationScenario } from '../types';
import { RiskTrend } from '../predictive/types';

/**
 * Calculate how risks would evolve under the given scenario
 */
export function calculateRiskTrends(currentRisks: RiskItem[], scenario: SimulationScenario): RiskTrend[] {
  const trends: RiskTrend[] = [];
  
  // Analyze each current risk
  currentRisks.forEach((risk) => {
    // Check if this risk is affected by any regulation changes in the scenario
    const affectedChange = scenario.regulationChanges.find(change => 
      change.regulation === risk.regulation);
    
    if (affectedChange) {
      let trendDirection: 'increase' | 'decrease' | 'stable';
      let impact: 'high' | 'medium' | 'low';
      
      // Determine trend direction based on change type
      if (affectedChange.changeType === 'stricter') {
        trendDirection = 'increase';
        impact = affectedChange.impactLevel;
      } else if (affectedChange.changeType === 'updated') {
        // For updates, randomly determine if risk increases or decreases
        trendDirection = Math.random() > 0.6 ? 'increase' : 'decrease';
        impact = affectedChange.impactLevel;
      } else if (affectedChange.changeType === 'new') {
        trendDirection = 'increase';
        impact = 'high';
      } else {
        trendDirection = 'stable';
        impact = 'low';
      }
      
      // Generate random scores for trend analysis
      const previousScore = Math.floor(Math.random() * 50) + 30;
      const scoreDiff = trendDirection === 'increase' ? Math.floor(Math.random() * 20) + 5 : 
                        trendDirection === 'decrease' ? -Math.floor(Math.random() * 20) - 5 : 
                        Math.floor(Math.random() * 6) - 3;
      const predictedScore = Math.max(0, Math.min(100, previousScore + scoreDiff));

      // Determine trend based on score difference
      const trend = scoreDiff > 3 ? 'increasing' :
                    scoreDiff < -3 ? 'decreasing' : 'stable';
      
      trends.push({
        riskId: risk.id || risk.description, // Use id if available, otherwise description
        description: risk.description,
        regulation: risk.regulation,
        currentSeverity: risk.severity,
        predictedChange: trendDirection,
        impact,
        previousScore,
        predictedScore,
        trend
      });
    } else {
      // Risk not directly affected by regulation changes
      const previousScore = Math.floor(Math.random() * 50) + 30;
      const minorChange = Math.floor(Math.random() * 6) - 3;
      const predictedScore = Math.max(0, Math.min(100, previousScore + minorChange));
      const trend = minorChange > 3 ? 'increasing' :
                    minorChange < -3 ? 'decreasing' : 'stable';
      
      trends.push({
        riskId: risk.id || risk.description, // Use id if available, otherwise description
        description: risk.description,
        regulation: risk.regulation,
        currentSeverity: risk.severity,
        predictedChange: 'stable',
        impact: 'low',
        previousScore,
        predictedScore,
        trend
      });
    }
  });
  
  return trends;
}
