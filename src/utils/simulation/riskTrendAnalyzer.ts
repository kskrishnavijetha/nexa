
import { Risk, RiskTrend, SimulationScenario, RiskSeverity } from '@/utils/types';

/**
 * Calculate risk trends based on current risks and simulation scenario
 */
export function calculateRiskTrends(
  currentRisks: Risk[],
  scenario: SimulationScenario
): RiskTrend[] {
  // Generate risk trends from current risks
  const trends: RiskTrend[] = [];
  
  // Get affected regulations from scenario
  const affectedRegulations = scenario.regulationChanges.map(c => c.regulation);
  
  // For each current risk, calculate the trend
  currentRisks.forEach(risk => {
    // If the risk is related to an affected regulation, or it's a random selection
    if (
      (risk.regulation && affectedRegulations.includes(risk.regulation)) ||
      Math.random() > 0.7
    ) {
      // Determine the likely change based on the scenario
      const relevantChange = scenario.regulationChanges.find(
        c => c.regulation === risk.regulation
      );
      
      let predictedChange: 'increase' | 'decrease' | 'stable';
      let probability = 0;
      
      if (relevantChange) {
        if (relevantChange.changeType === 'stricter' || relevantChange.changeType === 'new') {
          predictedChange = 'increase';
          probability = 0.8;
        } else if (relevantChange.changeType === 'relaxed') {
          predictedChange = 'decrease';
          probability = 0.7;
        } else {
          predictedChange = 'stable';
          probability = 0.5;
        }
      } else {
        // Random outcome with bias toward stability for non-directly affected risks
        const rand = Math.random();
        if (rand > 0.8) {
          predictedChange = 'increase';
          probability = 0.6;
        } else if (rand > 0.6) {
          predictedChange = 'decrease';
          probability = 0.6;
        } else {
          predictedChange = 'stable';
          probability = 0.8;
        }
      }
      
      // Calculate impact
      const impact = risk.severity === 'high' ? 'high' : 
                     risk.severity === 'medium' ? 'medium' : 'low';
      
      // Generate previous and predicted scores based on trend
      const previousScore = Math.floor(Math.random() * 30) + 60; // Range 60-90
      let predictedScore = previousScore;
      
      if (predictedChange === 'increase') {
        predictedScore = Math.min(100, previousScore + Math.floor(Math.random() * 15) + 5);
      } else if (predictedChange === 'decrease') {
        predictedScore = Math.max(30, previousScore - Math.floor(Math.random() * 15) - 5);
      }
      
      // Add trend with numeric probability and use correct trend values
      trends.push({
        id: `trend-${risk.id}`,
        riskId: risk.id || '',
        severity: risk.severity,
        title: risk.title || risk.description.split(': ')[0] || 'Risk',
        trend: predictedChange,
        impact: impact,
        probability: Math.round(probability * 100), // Convert to percentage as a number
        predictedChange: predictedChange,
        currentSeverity: risk.severity,
        regulation: risk.regulation || 'General',
        description: risk.description,
        previousScore: previousScore,
        predictedScore: predictedScore
      });
    }
  });
  
  return trends;
}
