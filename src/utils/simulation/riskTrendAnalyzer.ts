
import { Industry } from '../types';
import { Risk, RiskTrend, SimulationScenario, RegulationChange } from '@/utils/types';

/**
 * Generate risk trends based on scenario and existing risks
 */
export function analyzeRiskTrends(
  scenario: SimulationScenario, 
  existingRisks: Risk[] = []
): RiskTrend[] {
  const trends: RiskTrend[] = [];
  
  // First, analyze existing risks to see how they might be affected
  existingRisks.slice(0, 3).forEach(risk => {
    // Find relevant regulation changes
    const relevantChanges = scenario.regulationChanges.filter(
      change => change.regulation === risk.regulation
    );
    
    if (relevantChanges.length > 0) {
      // Determine how risk severity will change
      let trend: 'increase' | 'decrease' | 'stable' = 'stable';
      let projectedSeverity = risk.severity;
      
      for (const change of relevantChanges) {
        if (change.changeType === 'new' || change.changeType === 'update') {
          if (change.impactLevel === 'high') {
            trend = 'decrease';
            // Improve severity by one level if possible
            projectedSeverity = risk.severity === 'high' ? 'medium' : 
                               risk.severity === 'medium' ? 'low' : 'low';
            break;
          }
        } else {
          trend = 'increase';
          // Worsen severity by one level
          projectedSeverity = risk.severity === 'low' ? 'medium' : 
                             risk.severity === 'medium' ? 'high' : 'high';
          break;
        }
      }
      
      trends.push({
        regulation: risk.regulation,
        description: risk.description,
        trend,
        impact: relevantChanges[0].impactLevel,
        currentSeverity: risk.severity,
        projectedSeverity,
        previousScore: Math.round(Math.random() * 30) + 60, // Random score between 60-90
        predictedScore: trend === 'decrease' 
          ? Math.min(100, Math.round(Math.random() * 15) + 85) // Higher score (better) for decreasing risks
          : Math.max(40, Math.round(Math.random() * 20) + 40), // Lower score (worse) for increasing risks
      });
    }
  });
  
  // Then add trends for regulation changes that don't match existing risks
  scenario.regulationChanges.forEach(change => {
    // Skip if we already have a trend for this regulation
    if (trends.some(t => t.regulation === change.regulation)) {
      return;
    }
    
    // Skip if we already have enough trends
    if (trends.length >= 5) {
      return;
    }
    
    // Generate a new trend for this regulation change
    const newTrend = generateTrendFromChange(change, scenario.industry);
    if (newTrend) {
      trends.push(newTrend);
    }
  });
  
  return trends;
}

/**
 * Generate a risk trend from a regulation change
 */
function generateTrendFromChange(
  change: RegulationChange,
  industry?: string
): RiskTrend | null {
  let description = '';
  let currentSeverity: 'high' | 'medium' | 'low' = 'medium';
  let trend: 'increase' | 'decrease' | 'stable' = 'stable';
  
  // Determine description based on regulation
  if (change.regulation === 'GDPR') {
    description = 'Data protection compliance requirements';
    currentSeverity = 'medium';
  } else if (change.regulation === 'HIPAA') {
    description = 'Healthcare data security requirements';
    currentSeverity = 'high';
  } else if (change.regulation === 'SOC 2') {
    description = 'Service organization controls requirements';
    currentSeverity = 'medium';
  } else if (change.regulation === 'PCI-DSS') {
    description = 'Payment card data security requirements';
    currentSeverity = 'high';
  } else {
    description = `${change.regulation} compliance requirements`;
    currentSeverity = change.impactLevel === 'high' ? 'high' : 'medium';
  }
  
  // Add industry context if available
  if (industry) {
    description = `${description} for ${industry}`;
  }
  
  // Determine trend based on change type
  if (change.changeType === 'new') {
    trend = 'decrease'; // New regulations typically improve compliance when addressed
  } else if (change.changeType === 'update') {
    trend = change.impactLevel === 'high' ? 'decrease' : 'stable';
  } else {
    trend = 'increase'; // Repealed regulations might increase risk in some cases
  }
  
  // Determine projected severity
  const projectedSeverity = trend === 'decrease' 
    ? (currentSeverity === 'high' ? 'medium' : 'low')
    : trend === 'increase'
    ? (currentSeverity === 'low' ? 'medium' : 'high')
    : currentSeverity;
  
  return {
    regulation: change.regulation,
    description: `${description}: ${change.description}`,
    trend,
    impact: change.impactLevel,
    currentSeverity,
    projectedSeverity,
    previousScore: Math.round(Math.random() * 30) + 60, // Random score between 60-90
    predictedScore: trend === 'decrease' 
      ? Math.min(100, Math.round(Math.random() * 15) + 85) // Higher score (better) for decreasing risks
      : Math.max(40, Math.round(Math.random() * 20) + 40), // Lower score (worse) for increasing risks
  };
}
