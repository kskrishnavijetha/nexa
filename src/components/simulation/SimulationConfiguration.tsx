
import React from 'react';
import { SimulationScenario } from '@/utils/types';
import { AlertTriangle, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SimulationConfigurationProps {
  selectedScenario: SimulationScenario;
  simulationDepth: string;
  setSimulationDepth: (depth: string) => void;
  onBackToScenarios: () => void;
  onRunSimulation: (scenarioId: string) => void;
  isLoading: boolean;
}

const SimulationConfiguration: React.FC<SimulationConfigurationProps> = ({
  selectedScenario,
  simulationDepth,
  setSimulationDepth,
  onBackToScenarios,
  onRunSimulation,
  isLoading
}) => {
  return (
    <div className="mt-6 bg-slate-50 p-4 rounded-lg">
      <div className="mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBackToScenarios}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Scenarios
        </Button>
      </div>
      
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
          onClick={() => onRunSimulation(selectedScenario.id)} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Running Simulation...' : 'Run Simulation Analysis'}
        </Button>
      </div>
    </div>
  );
};

export default SimulationConfiguration;
