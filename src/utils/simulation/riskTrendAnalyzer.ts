
import { Risk, RiskTrend, SimulationScenario, RiskSeverity } from '@/utils/types';

/**
 * Analyzes risk trends based on a simulation scenario
 */
export function analyzeRiskTrends(risks: Risk[], scenario: SimulationScenario): RiskTrend[] {
  const trends: RiskTrend[] = [];
  
  // First, let's analyze existing risks and how they might change
  risks.forEach(risk => {
    // Check if scenario affects this risk's regulation
    const relevantChanges = scenario.regulationChanges.filter(change => 
      change.regulation === risk.regulation
    );
    
    if (relevantChanges.length > 0) {
      // Affected by regulation changes
      let trend: 'increase' | 'decrease' | 'stable' = 'stable';
      let impact: 'high' | 'medium' | 'low' = 'medium';
      let projectedSeverity: RiskSeverity = risk.severity;
      
      // Determine trend direction based on change type and impact level
      const highestImpactChange = relevantChanges.reduce((prev, current) => 
        (current.impactLevel === 'high' && prev.impactLevel !== 'high') ? current : prev
      );
      
      if (highestImpactChange.changeType === 'new' || 
         (highestImpactChange.changeType === 'update' && highestImpactChange.impactLevel === 'high')) {
        // New or major update to regulation typically decreases risk as compliance improves
        trend = 'decrease';
        impact = 'high';
        // Improve severity by one level if possible
        projectedSeverity = getImprovedSeverity(risk.severity);
      } else if (highestImpactChange.changeType === 'repeal') {
        // Repealing regulations may increase risk
        trend = 'increase';
        impact = 'medium';
        // Worsen severity by one level
        projectedSeverity = getWorsenedSeverity(risk.severity);
      }
      
      trends.push({
        riskId: risk.id,
        regulation: risk.regulation,
        description: risk.description,
        trend,
        impact,
        currentSeverity: risk.severity,
        projectedSeverity
      });
    }
  });
  
  // Now add trends for new potential risks based on the scenario
  scenario.regulationChanges.forEach(change => {
    // Skip if we already have a trend for this regulation
    if (trends.some(t => t.regulation === change.regulation)) {
      return;
    }
    
    let trend: 'increase' | 'decrease' | 'stable';
    let impact: 'high' | 'medium' | 'low';
    let currentSeverity: RiskSeverity;
    let projectedSeverity: RiskSeverity;
    
    if (change.changeType === 'new') {
      // New regulations typically start with high risk that decreases over time
      trend = 'decrease';
      impact = change.impactLevel as 'high' | 'medium' | 'low';
      currentSeverity = mapImpactToSeverity(change.impactLevel);
      projectedSeverity = getImprovedSeverity(currentSeverity);
    } else if (change.changeType === 'update') {
      // Updates typically reduce risk
      trend = 'decrease';
      impact = 'medium';
      currentSeverity = 'medium';
      projectedSeverity = 'low';
    } else {
      // Repeal might increase risk initially
      trend = 'increase';
      impact = 'medium';
      currentSeverity = 'low';
      projectedSeverity = 'medium';
    }
    
    trends.push({
      riskId: `trend-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      regulation: change.regulation,
      description: `Impact from ${change.description}`,
      trend,
      impact,
      currentSeverity,
      projectedSeverity
    });
  });
  
  return trends;
}

// Helper functions
function getImprovedSeverity(severity: RiskSeverity): RiskSeverity {
  if (severity === 'high') return 'medium';
  if (severity === 'medium') return 'low';
  return 'low';
}

function getWorsenedSeverity(severity: RiskSeverity): RiskSeverity {
  if (severity === 'low') return 'medium';
  if (severity === 'medium') return 'high';
  return 'high';
}

function mapImpactToSeverity(impact: string): RiskSeverity {
  if (impact === 'high') return 'high';
  if (impact === 'medium') return 'medium';
  return 'low';
}
