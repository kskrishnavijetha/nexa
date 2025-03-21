
import { 
  ComplianceReport, 
  ApiResponse,
  Industry, 
  SimulationScenario,
  RiskTrend,
  PredictiveAnalysis,
  RiskSeverity
} from './types';
import { generateSimulationScenarios } from './simulation/scenarioGenerator';
import { calculateRiskTrends } from './simulation/riskTrendAnalyzer';
import { calculateAdjustedScores } from './simulation/scoreCalculator';
import { generatePredictedRisks } from './simulation/riskPredictor';
import { generateRecommendations } from './simulation/recommendationGenerator';

export { generateSimulationScenarios };

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
    
    // Prepare the predictive analysis result with strictly typed properties
    const complianceInsights: Array<{
      title: string;
      description: string;
      actionRequired: boolean;
      priority: 'high' | 'medium' | 'low' | 'critical';
    }> = [
      {
        title: 'Regulatory Impact Analysis',
        description: `The simulation predicts a ${Math.abs(scoreDifferences.overall)}% ${scoreDifferences.overall >= 0 ? 'improvement' : 'decrease'} in overall compliance.`,
        actionRequired: scoreDifferences.overall < 0,
        priority: scoreDifferences.overall < -10 ? 'high' : scoreDifferences.overall < -5 ? 'medium' : 'low'
      },
      {
        title: 'Risk Exposure Profile',
        description: `Based on the simulation, ${riskTrends.filter(t => t.predictedChange === 'increase').length} risks are expected to increase in severity.`,
        actionRequired: riskTrends.filter(t => t.predictedChange === 'increase').length > 0,
        priority: riskTrends.filter(t => t.predictedChange === 'increase' && t.impact === 'high').length > 0 ? 'high' : 'medium'
      }
    ];
    
    // Convert riskTrends from simulation/riskTrendAnalyzer to the correct type if needed
    const typedRiskTrends: RiskTrend[] = riskTrends.map(trend => ({
      ...trend,
      currentSeverity: trend.currentSeverity as RiskSeverity
    }));
    
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
      complianceInsights,
      riskTrends: typedRiskTrends,
      recommendations,
      lastUpdated: new Date().toISOString(),
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
