import { ApiResponse } from './types';
import { Risk, SimulationScenario, RiskItem, PredictiveAnalysis, RegulationChange, RiskTrend, RiskSeverity } from '@/utils/types';
import { generateScenarios } from './simulation/scenarioGenerator';
import { generateRecommendations } from './simulation/recommendationGenerator';

/**
 * Generate risks based on simulation scenario
 */
function generateRisks(scenario: SimulationScenario): Risk[] {
  const risks: Risk[] = [];
  
  // Process regulation changes to identify risks
  scenario.regulationChanges.forEach(change => {
    // New regulations typically introduce compliance risks
    if (change.changeType === 'new') {
      if (change.impactLevel === 'high') {
        risks.push({
          id: `risk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: `${change.regulation} Compliance Gap`,
          description: `Potential gap in compliance with new ${change.regulation} requirements: ${change.description}`,
          severity: 'high',
          regulation: change.regulation,
          mitigation: `Conduct ${change.regulation} readiness assessment`
        });
      } else {
        risks.push({
          id: `risk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: `${change.regulation} Adaptation Risk`,
          description: `Adaptation needed for new ${change.regulation} requirements: ${change.description}`,
          severity: 'medium',
          regulation: change.regulation,
          mitigation: `Review and update ${change.regulation} compliance programs`
        });
      }
    }
    
    // Updates to existing regulations can create gaps
    if (change.changeType === 'update') {
      if (change.regulation === 'GDPR') {
        risks.push({
          id: `risk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: 'Data Protection Documentation Risk',
          description: `Need to update data protection documentation for ${change.description}`,
          severity: change.impactLevel === 'high' ? 'high' : 'medium',
          regulation: 'GDPR',
          mitigation: 'Review and update data protection policies and procedures'
        });
      }
      
      if (change.regulation === 'HIPAA') {
        risks.push({
          id: `risk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: 'PHI Security Controls Risk',
          description: `Potential gaps in PHI security controls for ${change.description}`,
          severity: change.impactLevel === 'high' ? 'high' : 'medium',
          regulation: 'HIPAA',
          mitigation: 'Enhance security controls for protected health information'
        });
      }
      
      if (change.regulation === 'SOC 2') {
        risks.push({
          id: `risk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: 'Service Organization Controls Risk',
          description: `Potential gaps in service controls for ${change.description}`,
          severity: change.impactLevel === 'high' ? 'high' : 'medium',
          regulation: 'SOC 2',
          mitigation: 'Update service organization controls and documentation'
        });
      }
      
      if (change.regulation === 'PCI-DSS') {
        risks.push({
          id: `risk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: 'Cardholder Data Environment Risk',
          description: `Security control gaps for cardholder data: ${change.description}`,
          severity: change.impactLevel === 'high' ? 'high' : 'medium',
          regulation: 'PCI-DSS',
          mitigation: 'Enhance security controls for cardholder data environment'
        });
      }
    }
    
    // Repeal of regulations can create compliance confusion
    if (change.changeType === 'repeal') {
      risks.push({
        id: `risk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: `${change.regulation} Transition Risk`,
        description: `Uncertainty during transition away from ${change.regulation} requirements`,
        severity: 'medium',
        regulation: change.regulation,
        mitigation: 'Develop transition plan and documentation updates'
      });
    }
  });
  
  // Add industry-specific risks
  if (scenario.industry === 'Healthcare') {
    risks.push({
      id: `risk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: 'Patient Data Access Controls Risk',
      description: 'Potential weaknesses in access controls for patient data',
      severity: 'high',
      regulation: 'HIPAA',
      mitigation: 'Implement enhanced authentication and access monitoring'
    });
  }
  
  if (scenario.industry === 'Finance & Banking') {
    risks.push({
      id: `risk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: 'Financial Transaction Security Risk',
      description: 'Potential vulnerabilities in financial transaction processing',
      severity: 'high',
      regulation: 'PCI-DSS',
      mitigation: 'Implement enhanced encryption and transaction monitoring'
    });
  }
  
  if (scenario.industry === 'Retail & Consumer') {
    risks.push({
      id: `risk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: 'Customer Data Privacy Risk',
      description: 'Inadequate customer data privacy controls',
      severity: 'medium',
      regulation: 'CCPA',
      mitigation: 'Enhance customer data privacy controls and consent management'
    });
  }
  
  if (scenario.industry === 'Cloud & SaaS') {
    risks.push({
      id: `risk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: 'Multi-Tenant Data Isolation Risk',
      description: 'Insufficient controls for data isolation in multi-tenant environments',
      severity: 'high',
      regulation: 'SOC 2',
      mitigation: 'Implement enhanced data isolation controls and monitoring'
    });
  }
  
  return risks;
}

/**
 * Generate projected compliance scores based on scenario
 */
function projectScores(scenario: SimulationScenario): Record<string, number> {
  // Base improvement values
  const baseImprovements = {
    overall: 0,
    gdpr: 0,
    hipaa: 0,
    soc2: 0,
    pciDss: 0
  };
  
  // Calculate improvements based on regulation changes
  scenario.regulationChanges.forEach(change => {
    const impactMultiplier = change.impactLevel === 'high' ? 8 : change.impactLevel === 'medium' ? 5 : 3;
    
    if (change.regulation === 'GDPR') {
      baseImprovements.gdpr += impactMultiplier;
      baseImprovements.overall += impactMultiplier * 0.5;
    }
    
    if (change.regulation === 'HIPAA') {
      baseImprovements.hipaa += impactMultiplier;
      baseImprovements.overall += impactMultiplier * 0.5;
    }
    
    if (change.regulation === 'SOC 2') {
      baseImprovements.soc2 += impactMultiplier;
      baseImprovements.overall += impactMultiplier * 0.5;
    }
    
    if (change.regulation === 'PCI-DSS') {
      baseImprovements.pciDss += impactMultiplier;
      baseImprovements.overall += impactMultiplier * 0.4;
    }
  });
  
  // Return the projected improvements
  return baseImprovements;
}

/**
 * Generate a risk trend analysis based on the scenario
 */
function generateRiskTrends(scenario: SimulationScenario, currentRisks: Risk[]): RiskTrend[] {
  const riskTrends: RiskTrend[] = [];
  
  // Create trends for existing risks
  currentRisks.slice(0, 3).forEach(risk => {
    let trend: 'increase' | 'decrease' | 'stable' = 'stable';
    let projectedSeverity = risk.severity;
    
    // Determine trend direction based on regulation changes
    for (const change of scenario.regulationChanges) {
      if (change.regulation === risk.regulation) {
        if (change.changeType === 'new' || change.changeType === 'update') {
          // New or updated regulations for this risk area
          if (change.impactLevel === 'high') {
            trend = 'decrease';
            // Improve severity by one level if possible
            projectedSeverity = risk.severity === 'high' ? 'medium' : 
                               risk.severity === 'medium' ? 'low' : 'low';
          } else {
            // Medium/low impact changes have a smaller effect
            trend = 'stable';
          }
        } else if (change.changeType === 'repeal') {
          trend = 'increase';
          // Worsen severity by one level
          projectedSeverity = risk.severity === 'low' ? 'medium' : 
                             risk.severity === 'medium' ? 'high' : 'high';
        }
      }
    }
    
    riskTrends.push({
      riskId: risk.id,
      regulation: risk.regulation,
      description: risk.description,
      trend,
      impact: trend === 'increase' ? 'high' : trend === 'decrease' ? 'medium' : 'low',
      currentSeverity: risk.severity,
      projectedSeverity
    });
  });
  
  // Add new trends based on the scenario
  scenario.regulationChanges.forEach(change => {
    // Skip if we already have enough trends or already have a trend for this regulation
    if (riskTrends.length >= 5 || riskTrends.some(t => t.regulation === change.regulation)) {
      return;
    }
    
    let trend: 'increase' | 'decrease' | 'stable';
    let currentSeverity: RiskSeverity;
    let projectedSeverity: RiskSeverity;
    
    if (change.changeType === 'new') {
      trend = 'decrease';
      currentSeverity = change.impactLevel === 'high' ? 'high' : 'medium';
      projectedSeverity = change.impactLevel === 'high' ? 'medium' : 'low';
    } else if (change.changeType === 'update') {
      trend = 'decrease';
      currentSeverity = 'medium';
      projectedSeverity = 'low';
    } else {
      trend = 'increase';
      currentSeverity = 'low';
      projectedSeverity = 'medium';
    }
    
    riskTrends.push({
      riskId: `trend-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      regulation: change.regulation,
      description: `Impact from ${change.description}`,
      trend,
      impact: change.impactLevel,
      currentSeverity,
      projectedSeverity
    });
  });
  
  return riskTrends;
}

/**
 * Get available simulation scenarios
 */
export const getSimulationScenarios = async (industry?: string): Promise<ApiResponse<SimulationScenario[]>> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate scenarios
    const scenarios = generateScenarios(industry as any);
    
    return {
      success: true,
      data: scenarios
    };
  } catch (error) {
    console.error('Error fetching simulation scenarios:', error);
    return {
      success: false,
      error: 'Failed to retrieve simulation scenarios. Please try again.'
    };
  }
};

/**
 * Run a compliance simulation based on the selected scenario
 */
export const runSimulation = async (
  scenarioId: string, 
  currentRisks: Risk[] = [],
  currentScores = { overall: 75, gdpr: 70, hipaa: 68, soc2: 72, pciDss: 65 }
): Promise<ApiResponse<PredictiveAnalysis>> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get all scenarios
    const scenariosResponse = await getSimulationScenarios();
    if (!scenariosResponse.success || !scenariosResponse.data) {
      throw new Error('Failed to fetch scenarios');
    }
    
    // Find the selected scenario
    const scenario = scenariosResponse.data.find(s => s.id === scenarioId);
    if (!scenario) {
      throw new Error('Selected scenario not found');
    }
    
    // Generate risks based on the scenario
    const predictedRisks = generateRisks(scenario);
    
    // Generate risk trends
    const riskTrends = generateRiskTrends(scenario, currentRisks);
    
    // Calculate projected scores
    const scoreImprovements = projectScores(scenario);
    
    // Original scores from input or defaults
    const originalScores = {
      overall: currentScores.overall,
      gdpr: currentScores.gdpr,
      hipaa: currentScores.hipaa,
      soc2: currentScores.soc2,
      pciDss: currentScores.pciDss
    };
    
    // Predicted scores
    const predictedScores = {
      overall: Math.min(100, Math.round(originalScores.overall + scoreImprovements.overall)),
      gdpr: Math.min(100, Math.round(originalScores.gdpr + scoreImprovements.gdpr)),
      hipaa: Math.min(100, Math.round(originalScores.hipaa + scoreImprovements.hipaa)),
      soc2: Math.min(100, Math.round(originalScores.soc2 + scoreImprovements.soc2)),
      pciDss: Math.min(100, Math.round(originalScores.pciDss + scoreImprovements.pciDss))
    };
    
    // Generate recommendations
    const recommendations = generateRecommendations(scenario);
    
    // Create the analysis result
    const analysis: PredictiveAnalysis = {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      scenarioDescription: scenario.description,
      industry: scenario.industry,
      regulationChanges: scenario.regulationChanges,
      recommendations,
      riskTrends,
      originalScores,
      predictedScores,
      scoreDifferences: {
        overall: predictedScores.overall - originalScores.overall,
        gdpr: predictedScores.gdpr - originalScores.gdpr,
        hipaa: predictedScores.hipaa - originalScores.hipaa,
        soc2: predictedScores.soc2 - originalScores.soc2,
        pciDss: predictedScores.pciDss - originalScores.pciDss
      }
    };
    
    return {
      success: true,
      data: analysis
    };
  } catch (error) {
    console.error('Error running simulation:', error);
    return {
      success: false,
      error: 'Failed to run the simulation. Please try again.'
    };
  }
};

export { generateScenarios };

export const runSimulationAnalysis = async (
  report: any,
  scenarioId: string
): Promise<ApiResponse<PredictiveAnalysis>> => {
  try {
    // Extract current risks from the report if available
    const currentRisks: Risk[] = report.risks || [];
    
    // Extract current scores from the report
    const currentScores = {
      overall: report.overallScore || 75,
      gdpr: report.gdprScore || 70,
      hipaa: report.hipaaScore || 68,
      soc2: report.soc2Score || 72,
      pciDss: report.pciDssScore || 65
    };
    
    // Run the simulation using existing function
    return await runSimulation(scenarioId, currentRisks, currentScores);
  } catch (error) {
    console.error('Error in simulation analysis:', error);
    return {
      success: false,
      error: 'Failed to run simulation analysis. Please try again.'
    };
  }
};
