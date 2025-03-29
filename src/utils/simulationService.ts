
import { Risk, SimulationScenario, RiskItem, PredictiveAnalysis, RegulationChange, RiskTrend } from '@/utils/types';
import { generateScenarios } from './simulation/scenarioGenerator';

/**
 * Generate predicted risks based on simulation scenario
 */
export function generatePredictedRisks(
  currentRisks: RiskItem[],
  scenario: SimulationScenario,
  adjustedScores: any
): Risk[] {
  const predictedRisks: Risk[] = [];
  
  // Based on regulation changes in the scenario, predict new risks
  scenario.regulationChanges.forEach(change => {
    if (change.changeType === 'stricter' || change.changeType === 'new') {
      if (change.regulation === 'GDPR') {
        predictedRisks.push({
          id: `predicted-gdpr-${Date.now()}`,
          title: 'Additional GDPR Requirements',
          description: 'New requirements for data protection impact assessments',
          severity: 'medium',
          mitigation: 'Implement DPIA procedures for high-risk processing',
          regulation: 'GDPR',
          section: 'Article 35'
        });
      }
      
      if (change.regulation === 'HIPAA') {
        predictedRisks.push({
          id: `predicted-hipaa-${Date.now()}`,
          title: 'Enhanced PHI Protection',
          description: 'Stricter requirements for protecting PHI in transit',
          severity: 'high',
          mitigation: 'Implement end-to-end encryption for all PHI transfers',
          regulation: 'HIPAA',
          section: '§164.312'
        });
      }
    }
    
    if (change.impactLevel === 'high') {
      if (change.regulation === 'PCI-DSS') {
        predictedRisks.push({
          id: `predicted-pci-${Date.now()}`,
          title: 'New PCI DSS Compliance',
          description: 'New requirements for multi-factor authentication',
          severity: 'high',
          mitigation: 'Implement MFA for all system access',
          regulation: 'PCI-DSS',
          section: 'Requirement 8.4'
        });
      }
      
      if (change.regulation === 'SOC 2') {
        predictedRisks.push({
          id: `predicted-soc2-${Date.now()}`,
          title: 'SOC 2 Security Updates',
          description: 'Enhanced monitoring requirements for access events',
          severity: 'medium',
          mitigation: 'Implement comprehensive logging and monitoring',
          regulation: 'SOC 2',
          section: 'CC7.2'
        });
      }
    }
    
    if (adjustedScores.gdprScore < 70) {
      predictedRisks.push({
        id: `predicted-score-gdpr-${Date.now()}`,
        title: 'GDPR Score Risk',
        description: 'Low GDPR compliance score presents significant risk',
        severity: 'medium',
        mitigation: 'Conduct a comprehensive GDPR gap analysis',
        regulation: 'GDPR',
        section: 'General'
      });
    }
    
    if (adjustedScores.hipaaScore < 65) {
      predictedRisks.push({
        id: `predicted-score-hipaa-${Date.now()}`,
        title: 'HIPAA Score Risk',
        description: 'Declining HIPAA compliance score requires attention',
        severity: 'high',
        mitigation: 'Prioritize HIPAA compliance remediation',
        regulation: 'HIPAA',
        section: 'General'
      });
    }
    
    if (adjustedScores.soc2Score < 70) {
      predictedRisks.push({
        id: `predicted-score-soc2-${Date.now()}`,
        title: 'SOC 2 Risk',
        description: 'Projected SOC 2 compliance issues need addressing',
        severity: 'high',
        mitigation: 'Address security controls before audit period',
        regulation: 'SOC 2',
        section: 'General'
      });
    }
    
    if (adjustedScores.pciDssScore < 75) {
      predictedRisks.push({
        id: `predicted-score-pci-${Date.now()}`,
        title: 'PCI Compliance Issue',
        description: 'PCI DSS compliance score below threshold',
        severity: 'medium',
        mitigation: 'Review and update cardholder data environment',
        regulation: 'PCI-DSS',
        section: 'General'
      });
    }
  });
  
  return predictedRisks;
}

/**
 * Run a simulation analysis for a compliance report
 * @param report The current compliance report
 * @param scenarioId The scenario ID to simulate
 * @returns A predictive analysis result
 */
export async function runSimulationAnalysis(report: any, scenarioId: string): Promise<{ error?: string; data?: PredictiveAnalysis }> {
  try {
    // Get the scenario based on ID
    const scenarios = generateScenarios(report.industry);
    const scenario = scenarios.find(s => s.id === scenarioId);
    
    if (!scenario) {
      return { error: 'Invalid scenario ID' };
    }
    
    // Calculate predicted scores based on the scenario
    const originalScores = {
      gdpr: report.gdprScore || 0,
      hipaa: report.hipaaScore || 0,
      soc2: report.soc2Score || 0,
      pciDss: report.pciDssScore || 0,
      overall: report.overallScore || 0
    };
    
    // Calculate predicted scores (simplified version)
    const predictedScores = {
      gdpr: Math.min(100, originalScores.gdpr + (scenario.predictedImprovements.gdprScore || 0)),
      hipaa: Math.min(100, originalScores.hipaa + (scenario.predictedImprovements.hipaaScore || 0)),
      soc2: Math.min(100, originalScores.soc2 + (scenario.predictedImprovements.soc2Score || 0)),
      pciDss: Math.min(100, originalScores.pciDss + (scenario.predictedImprovements.pciDssScore || 0)),
      overall: Math.min(100, originalScores.overall + scenario.predictedImprovements.overallScore)
    };
    
    // Calculate score differences
    const scoreDifferences = {
      gdpr: predictedScores.gdpr - originalScores.gdpr,
      hipaa: predictedScores.hipaa - originalScores.hipaa,
      soc2: predictedScores.soc2 - originalScores.soc2,
      pciDss: predictedScores.pciDss - originalScores.pciDss,
      overall: predictedScores.overall - originalScores.overall
    };
    
    // Generate risk trends based on the scenario
    const riskTrends: RiskTrend[] = generateRiskTrends(report.risks, scenario.regulationChanges);
    
    // Generate recommended actions
    const recommendedActions = scenario.actions.map(action => action);
    
    // Build the predictive analysis result
    const result: PredictiveAnalysis = {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      scenarioDescription: scenario.description,
      regulationChanges: scenario.regulationChanges,
      originalScores,
      predictedScores,
      scoreDifferences,
      riskTrends,
      recommendedActions,
      riskPredictions: [],
      complianceForecasts: {
        overallScore: predictedScores.overall,
        gdprScore: predictedScores.gdpr,
        hipaaScore: predictedScores.hipaa,
        soc2Score: predictedScores.soc2,
        pciDssScore: predictedScores.pciDss
      },
      timestamp: new Date().toISOString()
    };
    
    return { data: result };
  } catch (error) {
    console.error('Simulation analysis error:', error);
    return { error: 'Error running simulation analysis' };
  }
}

/**
 * Generate risk trends based on regulation changes
 */
function generateRiskTrends(currentRisks: any[], regulationChanges: RegulationChange[]): RiskTrend[] {
  const trends: RiskTrend[] = [];
  
  // Add trends for each regulation change
  regulationChanges.forEach(change => {
    // Find existing risks for this regulation
    const relatedRisks = currentRisks.filter(risk => risk.regulation === change.regulation);
    
    if (relatedRisks.length > 0) {
      // For existing risks, create trends
      relatedRisks.slice(0, 2).forEach(risk => {
        trends.push({
          riskId: risk.id || `risk-${Date.now()}`,
          description: risk.description || 'Compliance risk',
          regulation: risk.regulation,
          currentSeverity: risk.severity,
          predictedChange: change.changeType === 'stricter' ? 'increase' : 
                           change.changeType === 'relaxed' ? 'decrease' : 'stable',
          impact: change.impactLevel,
          previousScore: 65,
          predictedScore: change.changeType === 'stricter' ? 80 : 
                          change.changeType === 'relaxed' ? 45 : 65,
          trend: change.changeType === 'stricter' ? 'increase' : 
                 change.changeType === 'relaxed' ? 'decrease' : 'stable'
        });
      });
    } else {
      // Add a generic trend for this regulation
      trends.push({
        riskId: `new-risk-${Date.now()}`,
        description: `${change.regulation} compliance requirements`,
        regulation: change.regulation,
        currentSeverity: 'medium',
        predictedChange: change.changeType === 'new' || change.changeType === 'stricter' ? 'increase' : 'stable',
        impact: change.impactLevel,
        previousScore: 50,
        predictedScore: 75,
        trend: change.changeType === 'new' || change.changeType === 'stricter' ? 'increase' : 'stable'
      });
    }
  });
  
  return trends;
}

// Export the generateScenarios function from scenarioGenerator
export { generateScenarios } from './simulation/scenarioGenerator';
