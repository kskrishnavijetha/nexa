
import { 
  ComplianceReport, 
  ApiResponse,
  Industry, 
  SimulationScenario,
  RiskTrend,
  PredictiveAnalysis,
  RiskSeverity,
  RiskItem,
  ComplianceInsight,
  Risk
} from './types';
import { generateScenarios } from './simulation/scenarioGenerator';
import { calculateRiskTrends } from './simulation/riskTrendAnalyzer';
import { calculateAdjustedScores } from './simulation/scoreCalculator';
import { generatePredictedRisks } from './simulation/riskPredictor';
import { generateRecommendations } from './simulation/recommendationGenerator';

// Export the scenarios generation function with a more consistent name
export const generateSimulationScenarios = generateScenarios;

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
    const scenarios = generateScenarios(report.industry);
    const selectedScenario = scenarios.find(s => s.id === scenarioId);
    
    if (!selectedScenario) {
      return {
        success: false,
        error: 'Scenario not found'
      };
    }
    
    // Calculate risk trends and impact
    const riskTrends = calculateRiskTrends(report.risks, selectedScenario);
    
    // Adjust scores based on the scenario
    const adjustedScores = calculateAdjustedScores(
      report.gdprScore || 0,
      report.hipaaScore || 0,
      report.soc2Score || 0,
      report.pciDssScore || 0,
      report.industryScores || {},
      selectedScenario
    );
    
    // Generate predicted risks - convert Risk[] to RiskItem[]
    const predictedRisksInputs: RiskItem[] = report.risks.map(risk => ({
      id: risk.id || `risk-${Math.random().toString(36).substring(2, 9)}`,
      title: risk.title,
      name: risk.title,
      description: risk.description,
      severity: risk.severity,
      regulation: risk.regulation,
      likelihood: 0.5,
      section: risk.section,
      mitigation: risk.mitigation
    }));
    
    // Generate predicted risks using the RiskItem inputs
    const predictedRisks = generatePredictedRisks(predictedRisksInputs, selectedScenario, adjustedScores);
    
    // Generate recommendations to mitigate predicted risks
    const recommendations = generateRecommendations(predictedRisks, selectedScenario);
    
    // Calculate score differences
    const scoreDifferences = {
      gdpr: adjustedScores.gdprScore - (report.gdprScore || 0),
      hipaa: adjustedScores.hipaaScore - (report.hipaaScore || 0),
      soc2: adjustedScores.soc2Score - (report.soc2Score || 0),
      pciDss: (adjustedScores.pciDssScore || 0) - (report.pciDssScore || 0),
      overall: adjustedScores.overallScore - report.overallScore
    };
    
    // Prepare the predictive analysis result with strictly typed properties
    const complianceInsights: ComplianceInsight[] = [
      {
        title: 'Regulatory Impact Analysis',
        description: `The simulation predicts a ${Math.abs(scoreDifferences.overall)}% ${scoreDifferences.overall >= 0 ? 'improvement' : 'decrease'} in overall compliance.`,
        actionRequired: scoreDifferences.overall < 0,
        priority: scoreDifferences.overall < -10 ? 'high' : scoreDifferences.overall < -5 ? 'medium' : 'low'
      },
      {
        title: 'Risk Exposure Profile',
        description: `Based on the simulation, ${riskTrends.filter(t => t.trend === 'increase').length} risks are expected to increase in severity.`,
        actionRequired: riskTrends.filter(t => t.trend === 'increase').length > 0,
        priority: riskTrends.filter(t => t.trend === 'increase' && t.impact === 'high').length > 0 ? 'high' : 'medium'
      }
    ];
    
    // Convert riskTrends from simulation/riskTrendAnalyzer to the correct type if needed
    const typedRiskTrends: RiskTrend[] = riskTrends.map(trend => ({
      ...trend,
      currentSeverity: trend.currentSeverity as RiskSeverity
    }));
    
    // Convert predictedRisks to RiskItem[] for the analysis object
    const typedPredictedRisks: RiskItem[] = predictedRisks.map(risk => ({
      id: risk.id || `risk-item-${Math.random().toString(36).substring(2, 9)}`,
      title: risk.title,
      name: risk.title || risk.description.split(': ')[0],
      description: risk.description,
      severity: risk.severity,
      regulation: risk.regulation,
      likelihood: 0.5,
      section: risk.section,
      mitigation: risk.mitigation
    }));
    
    const analysis: PredictiveAnalysis = {
      scenarioId,
      scenarioName: selectedScenario.name,
      scenarioDescription: selectedScenario.description,
      regulationChanges: selectedScenario.regulationChanges,
      originalScores: {
        gdpr: report.gdprScore || 0,
        hipaa: report.hipaaScore || 0,
        soc2: report.soc2Score || 0,
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
      predictedRisks: typedPredictedRisks,
      complianceInsights,
      riskTrends: typedRiskTrends,
      recommendedActions: recommendations,
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      riskPredictions: []
    };
    
    return {
      success: true,
      data: analysis
    };
  } catch (error) {
    console.error('Predictive analysis error:', error);
    return {
      success: false,
      error: 'Failed to run predictive analysis. Please try again.'
    };
  }
};
