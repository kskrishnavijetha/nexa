
import { SimulationScenario } from '../types';

/**
 * Calculate adjusted compliance scores based on the simulation scenario
 */
export function calculateAdjustedScores(
  gdprScore: number,
  hipaaScore: number,
  soc2Score: number,
  pciDssScore: number,
  industryScores: Record<string, number>,
  scenario: SimulationScenario
) {
  const adjustedScores = {
    gdprScore,
    hipaaScore,
    soc2Score,
    pciDssScore,
    industryScores: { ...industryScores },
    overallScore: 0
  };
  
  // Adjust scores based on regulation changes
  scenario.regulationChanges.forEach(change => {
    const impactFactor = 
      change.impactLevel === 'high' ? -15 : 
      change.impactLevel === 'medium' ? -10 : -5;
    
    // Apply stricter impact for specific change types
    const severityMultiplier = 
      change.changeType === 'update' && change.description?.includes('stricter') ? 1.2 : 
      change.changeType === 'new' ? 1.5 : 1;
    
    const scoreImpact = impactFactor * severityMultiplier;
    
    // Apply score changes to the relevant compliance framework
    switch (change.regulation) {
      case 'GDPR':
        adjustedScores.gdprScore = Math.max(0, Math.min(100, gdprScore + scoreImpact));
        break;
      case 'HIPAA':
      case 'HITECH':
        adjustedScores.hipaaScore = Math.max(0, Math.min(100, hipaaScore + scoreImpact));
        break;
      case 'SOC 2':
        adjustedScores.soc2Score = Math.max(0, Math.min(100, soc2Score + scoreImpact));
        break;
      case 'PCI-DSS':
        adjustedScores.pciDssScore = Math.max(0, Math.min(100, pciDssScore + scoreImpact));
        break;
      default:
        // Handle industry-specific regulations
        if (adjustedScores.industryScores[change.regulation]) {
          adjustedScores.industryScores[change.regulation] = Math.max(0, Math.min(100, 
            adjustedScores.industryScores[change.regulation] + scoreImpact));
        }
    }
  });
  
  // Recalculate overall score
  const allScores = [
    adjustedScores.gdprScore, 
    adjustedScores.hipaaScore, 
    adjustedScores.soc2Score, 
    adjustedScores.pciDssScore, 
    ...Object.values(adjustedScores.industryScores)
  ];
  
  adjustedScores.overallScore = Math.floor(
    allScores.reduce((sum, score) => sum + score, 0) / allScores.length
  );
  
  return adjustedScores;
}
