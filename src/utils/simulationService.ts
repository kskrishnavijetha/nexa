
import { 
  ComplianceReport, 
  RiskItem, 
  ApiResponse,
  Industry, 
  SimulationScenario,
  RiskTrend,
  PredictiveAnalysis
} from './types';
import { generateRisks } from './riskService';
import { generateSuggestions } from './suggestionService';
import { generateScores } from './scoreService';

/**
 * Generate a set of simulation scenarios for predictive analysis
 */
export function generateSimulationScenarios(industry?: Industry): SimulationScenario[] {
  const scenarios: SimulationScenario[] = [
    {
      id: 'strict-gdpr',
      name: 'Enhanced GDPR Requirements',
      description: 'Simulates stricter GDPR enforcement with additional data protection requirements.',
      regulationChanges: [
        { regulation: 'GDPR', changeType: 'stricter', impactLevel: 'high' }
      ]
    },
    {
      id: 'new-hipaa',
      name: 'Updated HIPAA Security Rules',
      description: 'Simulates the introduction of enhanced HIPAA security requirements for healthcare providers.',
      regulationChanges: [
        { regulation: 'HIPAA', changeType: 'updated', impactLevel: 'medium' }
      ]
    },
    {
      id: 'multi-regulation',
      name: 'Multi-Regulation Compliance Update',
      description: 'Simulates concurrent updates to multiple compliance frameworks affecting your organization.',
      regulationChanges: [
        { regulation: 'GDPR', changeType: 'updated', impactLevel: 'medium' },
        { regulation: 'SOC 2', changeType: 'stricter', impactLevel: 'high' },
        { regulation: 'PCI-DSS', changeType: 'updated', impactLevel: 'low' }
      ]
    }
  ];
  
  // Add industry-specific scenarios if an industry is provided
  if (industry) {
    switch(industry) {
      case 'Healthcare':
        scenarios.push({
          id: 'healthcare-regulation',
          name: 'New Healthcare Data Sovereignty Rules',
          description: 'Simulates new requirements for healthcare data localization and sovereignty.',
          regulationChanges: [
            { regulation: 'HIPAA', changeType: 'new', impactLevel: 'high' },
            { regulation: 'HITECH', changeType: 'updated', impactLevel: 'medium' }
          ]
        });
        break;
      case 'Financial Services':
        scenarios.push({
          id: 'financial-regulation',
          name: 'Enhanced Financial Security Standards',
          description: 'Simulates stricter security requirements for financial institutions.',
          regulationChanges: [
            { regulation: 'PCI-DSS', changeType: 'stricter', impactLevel: 'high' },
            { regulation: 'SOX', changeType: 'updated', impactLevel: 'medium' }
          ]
        });
        break;
      case 'Technology & IT':
        scenarios.push({
          id: 'tech-privacy',
          name: 'New Global Privacy Framework',
          description: 'Simulates the introduction of a new global privacy standard affecting tech companies.',
          regulationChanges: [
            { regulation: 'GDPR', changeType: 'stricter', impactLevel: 'high' },
            { regulation: 'CCPA', changeType: 'updated', impactLevel: 'medium' },
            { regulation: 'ISO/IEC 27001', changeType: 'updated', impactLevel: 'medium' }
          ]
        });
        break;
      default:
        // Add a generic scenario for other industries
        scenarios.push({
          id: 'industry-specific',
          name: `${industry} Regulatory Update`,
          description: `Simulates potential regulatory changes specific to the ${industry} industry.`,
          regulationChanges: [
            { regulation: 'ISO 9001', changeType: 'updated', impactLevel: 'medium' }
          ]
        });
    }
  }
  
  return scenarios;
}

/**
 * Run a predictive analysis based on a scenario
 */
export const runPredictiveAnalysis = async (
  report: ComplianceReport,
  scenarioId: string
): Promise<ApiResponse<PredictiveAnalysis>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Get simulation scenarios
    const scenarios = generateSimulationScenarios(report.industry);
    const selectedScenario = scenarios.find(s => s.id === scenarioId);
    
    if (!selectedScenario) {
      return {
        error: 'Scenario not found',
        status: 404
      };
    }
    
    // Calculate risk trends and impact
    const riskTrends = calculateRiskTrends(report.risks, selectedScenario);
    
    // Adjust scores based on the scenario
    const adjustedScores = calculateAdjustedScores(
      report.gdprScore,
      report.hipaaScore,
      report.soc2Score,
      report.pciDssScore || 0,
      report.industryScores || {},
      selectedScenario
    );
    
    // Generate predicted risks
    const predictedRisks = generatePredictedRisks(report.risks, selectedScenario, adjustedScores);
    
    // Generate recommendations to mitigate predicted risks
    const recommendations = generateRecommendations(predictedRisks, selectedScenario);
    
    // Calculate score differences
    const scoreDifferences = {
      gdpr: adjustedScores.gdprScore - report.gdprScore,
      hipaa: adjustedScores.hipaaScore - report.hipaaScore,
      soc2: adjustedScores.soc2Score - report.soc2Score,
      pciDss: (adjustedScores.pciDssScore || 0) - (report.pciDssScore || 0),
      overall: adjustedScores.overallScore - report.overallScore
    };
    
    // Prepare the predictive analysis result
    const analysis: PredictiveAnalysis = {
      scenarioId,
      scenarioName: selectedScenario.name,
      scenarioDescription: selectedScenario.description,
      regulationChanges: selectedScenario.regulationChanges,
      originalScores: {
        gdpr: report.gdprScore,
        hipaa: report.hipaaScore,
        soc2: report.soc2Score,
        pciDss: report.pciDssScore || 0,
        overall: report.overallScore
      },
      predictedScores: {
        gdpr: adjustedScores.gdprScore,
        hipaa: adjustedScores.hipaaScore,
        soc2: adjustedScores.soc2Score,
        pciDss: adjustedScores.pciDssScore || 0,
        overall: adjustedScores.overallScore
      },
      scoreDifferences,
      predictedRisks,
      riskTrends,
      recommendations,
      timestamp: new Date().toISOString()
    };
    
    return {
      data: analysis,
      status: 200
    };
  } catch (error) {
    console.error('Predictive analysis error:', error);
    return {
      error: 'Failed to run predictive analysis. Please try again.',
      status: 500
    };
  }
};

/**
 * Calculate how risks would evolve under the given scenario
 */
function calculateRiskTrends(currentRisks: RiskItem[], scenario: SimulationScenario): RiskTrend[] {
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
      
      trends.push({
        riskId: risk.description, // Using description as a unique identifier
        description: risk.description,
        regulation: risk.regulation,
        currentSeverity: risk.severity,
        predictedChange: trendDirection,
        impact
      });
    } else {
      // Risk not directly affected by regulation changes
      trends.push({
        riskId: risk.description,
        description: risk.description,
        regulation: risk.regulation,
        currentSeverity: risk.severity,
        predictedChange: 'stable',
        impact: 'low'
      });
    }
  });
  
  return trends;
}

/**
 * Calculate adjusted compliance scores based on the simulation scenario
 */
function calculateAdjustedScores(
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
    
    // Apply stricter impact for 'stricter' or 'new' change types
    const severityMultiplier = 
      change.changeType === 'stricter' ? 1.2 : 
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

/**
 * Generate predicted risks based on the simulation scenario
 */
function generatePredictedRisks(
  currentRisks: RiskItem[], 
  scenario: SimulationScenario,
  adjustedScores: any
): RiskItem[] {
  // Start with existing risks
  const predictedRisks: RiskItem[] = [...currentRisks];
  
  // For each regulation change, potentially add new risks
  scenario.regulationChanges.forEach(change => {
    if (change.changeType === 'stricter' || change.changeType === 'new') {
      // Define potential new risks based on regulation
      const potentialNewRisks: Record<string, RiskItem[]> = {
        'GDPR': [
          {
            description: 'Insufficient data portability mechanism',
            severity: 'medium',
            regulation: 'GDPR',
            section: 'Article 20'
          },
          {
            description: 'Inadequate cross-border data transfer safeguards',
            severity: 'high',
            regulation: 'GDPR',
            section: 'Article 44-50'
          }
        ],
        'HIPAA': [
          {
            description: 'Insufficient audit controls for PHI access',
            severity: 'high',
            regulation: 'HIPAA',
            section: '164.312(b)'
          },
          {
            description: 'Inadequate emergency access procedure',
            severity: 'medium',
            regulation: 'HIPAA',
            section: '164.312(a)(2)(ii)'
          }
        ],
        'SOC 2': [
          {
            description: 'Weak change management controls',
            severity: 'medium',
            regulation: 'SOC 2',
            section: 'CC8.1'
          },
          {
            description: 'Insufficient system monitoring',
            severity: 'high',
            regulation: 'SOC 2',
            section: 'CC7.2'
          }
        ],
        'PCI-DSS': [
          {
            description: 'Inadequate network security controls',
            severity: 'high',
            regulation: 'PCI-DSS',
            section: 'Requirement 1.1.4'
          },
          {
            description: 'Insufficient cryptographic key management',
            severity: 'medium',
            regulation: 'PCI-DSS',
            section: 'Requirement 3.5'
          }
        ]
      };
      
      // Add 1-2 new risks if they don't already exist
      if (potentialNewRisks[change.regulation]) {
        const newRisks = potentialNewRisks[change.regulation];
        const numberOfRisksToAdd = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < Math.min(numberOfRisksToAdd, newRisks.length); i++) {
          const newRisk = newRisks[i];
          // Check if risk already exists
          const riskExists = predictedRisks.some(r => 
            r.description === newRisk.description && r.regulation === newRisk.regulation);
          
          if (!riskExists) {
            predictedRisks.push(newRisk);
          }
        }
      }
    }
  });
  
  return predictedRisks;
}

/**
 * Generate recommendations to mitigate predicted risks
 */
function generateRecommendations(predictedRisks: RiskItem[], scenario: SimulationScenario): string[] {
  const recommendations: string[] = [];
  
  // Add general recommendations based on scenario
  scenario.regulationChanges.forEach(change => {
    switch(change.regulation) {
      case 'GDPR':
        if (change.changeType === 'stricter' || change.changeType === 'new') {
          recommendations.push('Implement a comprehensive data mapping and classification process to identify all personal data flows');
          recommendations.push('Review and update your data subject rights procedures to ensure compliance with enhanced requirements');
        }
        break;
      case 'HIPAA':
        if (change.changeType === 'stricter' || change.changeType === 'new') {
          recommendations.push('Enhance audit trail capabilities to track all PHI access and modifications');
          recommendations.push('Update security risk assessment procedures to align with new HIPAA requirements');
        }
        break;
      case 'SOC 2':
        if (change.changeType === 'stricter' || change.changeType === 'updated') {
          recommendations.push('Strengthen change management controls with additional approval workflows');
          recommendations.push('Enhance system monitoring capabilities to detect security events in real-time');
        }
        break;
      case 'PCI-DSS':
        if (change.changeType === 'stricter' || change.changeType === 'new') {
          recommendations.push('Implement enhanced network segmentation to better protect cardholder data environment');
          recommendations.push('Review and upgrade cryptographic controls for payment data protection');
        }
        break;
    }
  });
  
  // Add risk-specific recommendations
  const highSeverityRisks = predictedRisks.filter(risk => risk.severity === 'high');
  if (highSeverityRisks.length > 0) {
    recommendations.push('Develop a prioritized remediation plan focusing on high-severity risks');
  }
  
  // Add unique recommendations based on regulation areas with multiple risks
  const regulationRiskCounts: Record<string, number> = {};
  predictedRisks.forEach(risk => {
    regulationRiskCounts[risk.regulation] = (regulationRiskCounts[risk.regulation] || 0) + 1;
  });
  
  Object.entries(regulationRiskCounts).forEach(([regulation, count]) => {
    if (count >= 2) {
      recommendations.push(`Conduct a focused compliance review of ${regulation} controls to address multiple identified risks`);
    }
  });
  
  // Return unique set of recommendations
  return [...new Set(recommendations)];
}
