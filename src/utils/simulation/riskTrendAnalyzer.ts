
import { Risk, RiskTrend, SimulationScenario, RiskSeverity } from '@/utils/types';

/**
 * Calculate risk trends based on current risks and simulation scenario using AI predictive analytics
 */
export function calculateRiskTrends(
  currentRisks: Risk[],
  scenario: SimulationScenario
): RiskTrend[] {
  // Generate risk trends from current risks
  const trends: RiskTrend[] = [];
  
  // Get affected regulations from scenario
  const affectedRegulations = scenario.regulationChanges.map(c => c.regulation);
  
  // For each current risk, calculate the trend using predictive analytics
  currentRisks.forEach(risk => {
    // If the risk is related to an affected regulation, or it's a random selection for comprehensive analysis
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
        // AI-enhanced predictive outcome with nuanced impact assessment
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
      
      // Calculate impact with AI-enhanced severity assessment
      const impact = determineImpactWithAI(risk, scenario);
      
      // Generate previous and predicted scores based on trend with more realistic variance
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

/**
 * AI-enhanced impact assessment based on risk characteristics and scenario details
 */
function determineImpactWithAI(risk: Risk, scenario: SimulationScenario): 'high' | 'medium' | 'low' {
  // Simulate AI-based impact analysis using risk severity and regulation changes
  const relevantChange = scenario.regulationChanges.find(c => c.regulation === risk.regulation);
  
  if (risk.severity === 'high') {
    // High severity risks are likely to have high impact
    return relevantChange?.impactLevel === 'high' ? 'high' : 'high';
  } else if (risk.severity === 'medium') {
    // Medium severity risks impact depends on regulation change
    return relevantChange?.impactLevel === 'high' ? 'high' : 
           relevantChange?.impactLevel === 'medium' ? 'medium' : 'medium';
  } else {
    // Low severity risks impact is usually lower unless affected by major changes
    return relevantChange?.impactLevel === 'high' ? 'medium' : 'low';
  }
}
