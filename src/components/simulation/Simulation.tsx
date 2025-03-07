
import React, { useState } from 'react';
import { ComplianceReport, PredictiveAnalysis, SimulationScenario } from '@/utils/types';
import { generateSimulationScenarios, runPredictiveAnalysis } from '@/utils/simulationService';
import ScenarioSelector from './ScenarioSelector';
import SimulationResults from './SimulationResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar } from 'lucide-react';
import { toast } from 'sonner';

interface SimulationProps {
  report: ComplianceReport;
}

const Simulation: React.FC<SimulationProps> = ({ report }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PredictiveAnalysis | null>(null);
  
  // Get scenarios based on industry
  const scenarios = generateSimulationScenarios(report.industry);
  
  const handleSelectScenario = (scenarioId: string) => {
    if (isLoading) return;
    
    if (selectedScenarioId === scenarioId && !analysisResult) {
      // Run simulation if same scenario is clicked twice and no result yet
      runSimulation(scenarioId);
    } else {
      // Just select the scenario
      setSelectedScenarioId(scenarioId);
      setAnalysisResult(null);
    }
  };
  
  const runSimulation = async (scenarioId: string) => {
    setIsLoading(true);
    
    try {
      const response = await runPredictiveAnalysis(report, scenarioId);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }
      
      if (response.data) {
        setAnalysisResult(response.data);
        toast.success('Predictive analysis completed');
      }
    } catch (error) {
      console.error('Simulation error:', error);
      toast.error('Failed to run simulation analysis');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetSimulation = () => {
    setAnalysisResult(null);
    setSelectedScenarioId(undefined);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Radar className="h-5 w-5 text-primary mr-2" />
          <CardTitle>Scenario Simulation & Predictive Analytics</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Simulate potential changes in compliance policies to predict future risks and assess the impact of regulatory changes.
        </p>
        
        {!analysisResult ? (
          <ScenarioSelector 
            scenarios={scenarios}
            onSelectScenario={handleSelectScenario}
            isLoading={isLoading}
            selectedScenarioId={selectedScenarioId}
          />
        ) : (
          <SimulationResults 
            analysis={analysisResult}
            onReset={resetSimulation}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Simulation;
