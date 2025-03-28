
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
      
      let predictedChange: 'increasing' | 'decreasing' | 'stable';
      let probability = 0;
      
      if (relevantChange) {
        if (relevantChange.changeType === 'stricter' || relevantChange.changeType === 'new') {
          predictedChange = 'increasing';
          probability = 0.8;
        } else if (relevantChange.changeType === 'relaxed') {
          predictedChange = 'decreasing';
          probability = 0.7;
        } else {
          predictedChange = 'stable';
          probability = 0.5;
        }
      } else {
        // Random outcome with bias toward stability for non-directly affected risks
        const rand = Math.random();
        if (rand > 0.8) {
          predictedChange = 'increasing';
          probability = 0.6;
        } else if (rand > 0.6) {
          predictedChange = 'decreasing';
          probability = 0.6;
        } else {
          predictedChange = 'stable';
          probability = 0.8;
        }
      }
      
      // Calculate impact
      const impact = risk.severity === 'high' ? 'high' : 
                     risk.severity === 'medium' ? 'medium' : 'low';
      
      // Add trend with numeric probability
      trends.push({
        id: `trend-${risk.id}`,
        riskId: risk.id,
        severity: risk.severity,
        title: risk.title || risk.description.split(': ')[0] || 'Risk',
        trend: predictedChange,
        impact: impact,
        probability: Math.round(probability * 100), // Convert to percentage as a number
        currentSeverity: risk.severity,
        regulation: risk.regulation || 'General',
        description: risk.description
      });
    }
  });
  
  return trends;
}
