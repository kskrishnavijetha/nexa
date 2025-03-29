
import React, { useState } from 'react';
import { ComplianceReport, PredictiveAnalysis, SimulationScenario } from '@/utils/types';
import { generateScenarios, runSimulationAnalysis } from '@/utils/simulationService';
import ScenarioSelector from './ScenarioSelector';
import SimulationResults from './SimulationResults';
import SimulationConfiguration from './SimulationConfiguration';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SimulationWrapperProps {
  report: ComplianceReport;
}

const SimulationWrapper: React.FC<SimulationWrapperProps> = ({ report }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PredictiveAnalysis | null>(null);
  const [simulationDepth, setSimulationDepth] = useState<string>("medium");
  const [showConfiguration, setShowConfiguration] = useState(false);
  
  // Get scenarios based on industry
  const scenarios = generateScenarios(report.industry);
  
  const handleSelectScenario = (scenarioId: string) => {
    if (isLoading) return;
    
    if (selectedScenarioId === scenarioId && !analysisResult) {
      // Show configuration when same scenario is clicked twice
      setShowConfiguration(true);
    } else {
      // Just select the scenario
      setSelectedScenarioId(scenarioId);
      setAnalysisResult(null);
    }
  };
  
  const runSimulation = async (scenarioId: string) => {
    setIsLoading(true);
    
    try {
      const response = await runSimulationAnalysis(report, scenarioId);
      
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
    setShowConfiguration(false);
  };

  const backToScenarioSelection = () => {
    setShowConfiguration(false);
  };
  
  // Get the selected scenario details
  const selectedScenario = selectedScenarioId 
    ? scenarios.find(s => s.id === selectedScenarioId) 
    : undefined;

  return (
    <>
      {!analysisResult ? (
        <>
          <ScenarioSelector 
            scenarios={scenarios}
            onSelectScenario={handleSelectScenario}
            isLoading={isLoading}
            selectedScenarioId={selectedScenarioId}
            hideRunButton={showConfiguration}
          />
          
          {selectedScenarioId && selectedScenario && showConfiguration && (
            <SimulationConfiguration
              selectedScenario={selectedScenario}
              simulationDepth={simulationDepth}
              setSimulationDepth={setSimulationDepth}
              onBackToScenarios={backToScenarioSelection}
              onRunSimulation={runSimulation}
              isLoading={isLoading}
            />
          )}
        </>
      ) : (
        <>
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={resetSimulation}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Scenarios
            </Button>
          </div>
          <SimulationResults 
            analysis={analysisResult}
            onReset={resetSimulation}
          />
        </>
      )}
    </>
  );
};

export default SimulationWrapper;
