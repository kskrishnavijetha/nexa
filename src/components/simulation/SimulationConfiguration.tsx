
import React from 'react';
import { SimulationScenario } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';

interface SimulationConfigurationProps {
  selectedScenario: SimulationScenario;
  simulationDepth: string;
  setSimulationDepth: React.Dispatch<React.SetStateAction<string>>;
  onBackToScenarios: () => void;
  onRunSimulation: () => void;
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
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={onBackToScenarios}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Scenarios
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-4">Configure Simulation: {selectedScenario.name}</h3>
        
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Simulation Depth</p>
            <Select value={simulationDepth} onValueChange={setSimulationDepth}>
              <SelectTrigger>
                <SelectValue placeholder="Select simulation depth" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic (Quick Analysis)</SelectItem>
                <SelectItem value="medium">Medium (Recommended)</SelectItem>
                <SelectItem value="detailed">Detailed (In-depth Analysis)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Determines the level of detail in the simulation results
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Scenario Actions</p>
            <div className="space-y-2">
              {selectedScenario.actions && selectedScenario.actions.map((action, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                  <p className="text-sm">{action}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={onRunSimulation} 
              disabled={isLoading}
              className="flex items-center"
            >
              {isLoading ? (
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <PlayCircle className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Running Simulation...' : 'Run Simulation'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationConfiguration;
