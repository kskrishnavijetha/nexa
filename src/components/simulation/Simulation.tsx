
import React, { useState } from 'react';
import { ComplianceReport, PredictiveAnalysis, SimulationScenario } from '@/utils/types';
import { generateSimulationScenarios, runPredictiveAnalysis } from '@/utils/simulationService';
import ScenarioSelector from './ScenarioSelector';
import SimulationResults from './SimulationResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SimulationProps {
  report: ComplianceReport;
}

const Simulation: React.FC<SimulationProps> = ({ report }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PredictiveAnalysis | null>(null);
  const [simulationDepth, setSimulationDepth] = useState<string>("medium");
  
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
    setSimulationDepth("medium");
  };
  
  // Get the selected scenario details
  const selectedScenario = selectedScenarioId 
    ? scenarios.find(s => s.id === selectedScenarioId) 
    : undefined;
  
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
          <>
            <ScenarioSelector 
              scenarios={scenarios}
              onSelectScenario={handleSelectScenario}
              isLoading={isLoading}
              selectedScenarioId={selectedScenarioId}
            />
            
            {selectedScenarioId && selectedScenario && (
              <div className="mt-6 bg-slate-50 p-4 rounded-lg">
                <h3 className="text-md font-semibold mb-2">Simulation Configuration</h3>
                
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Simulation Scenario:</p>
                      <p className="text-sm text-amber-900">{selectedScenario.name}</p>
                      <p className="text-xs text-amber-800 mt-1">{selectedScenario.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Simulation Depth</label>
                    <Select value={simulationDepth} onValueChange={setSimulationDepth}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select depth" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (Quick Analysis)</SelectItem>
                        <SelectItem value="medium">Medium (Standard Analysis)</SelectItem>
                        <SelectItem value="deep">Deep (Comprehensive Analysis)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-1">
                      Determines how thorough the simulation analysis will be
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <div className="flex gap-2">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-700">Affected Regulations</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedScenario.regulationChanges.map((change, index) => (
                            <span 
                              key={index}
                              className={`text-xs px-1.5 py-0.5 rounded ${
                                change.impactLevel === 'high' ? 'bg-red-100 text-red-800' :
                                change.impactLevel === 'medium' ? 'bg-amber-100 text-amber-800' :
                                'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {change.regulation}: {change.changeType}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => runSimulation(selectedScenarioId)} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Running Simulation...' : 'Run Simulation Analysis'}
                  </Button>
                </div>
              </div>
            )}
          </>
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
