
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
  if (scenario.regulationChanges && Array.isArray(scenario.regulationChanges)) {
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
  }
  
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
  if (scenario.regulationChanges && Array.isArray(scenario.regulationChanges)) {
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
  }
  
  // Return the projected improvements
  return baseImprovements;
}

/**
 * Generate a risk trend analysis based on the scenario
 */
function generateRiskTrends(scenario: SimulationScenario, currentRisks: Risk[]): RiskTrend[] {
  const trends: RiskTrend[] = [];
  
  // Create trends for existing risks
  currentRisks.slice(0, 3).forEach(risk => {
    // Check if scenario affects this risk's regulation
    const relevantChanges = scenario.regulationChanges && Array.isArray(scenario.regulationChanges) 
      ? scenario.regulationChanges.filter(change => change.regulation === risk.regulation)
      : [];
    
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
  
  // Add new trends based on the scenario
  if (scenario.regulationChanges && Array.isArray(scenario.regulationChanges)) {
    scenario.regulationChanges.forEach(change => {
      // Skip if we already have enough trends or already have a trend for this regulation
      if (trends.length >= 5 || trends.some(t => t.regulation === change.regulation)) {
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
  }
  
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
      error: error instanceof Error ? error.message : 'Failed to run the simulation. Please try again.'
    };
  }
};

export { generateScenarios };

export const runSimulationAnalysis = async (
  report: any,
  scenarioId: string
): Promise<ApiResponse<PredictiveAnalysis>> => {
  try {
    if (!report || !report.documentId || !report.industry) {
      throw new Error("Invalid report data for simulation");
    }
    
    if (!scenarioId) {
      throw new Error("No scenario selected");
    }
    
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
      error: error instanceof Error ? error.message : 'Failed to run simulation analysis. Please try again.'
    };
  }
};
