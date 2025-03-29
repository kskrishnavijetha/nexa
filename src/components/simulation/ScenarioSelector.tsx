
import React from 'react';
import { SimulationScenario } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Play, Trash2 } from 'lucide-react';

interface ScenarioSelectorProps {
  scenarios: SimulationScenario[];
  onSelectScenario: (scenarioId: string) => void;
  selectedScenarioId?: string;
  isLoading: boolean;
  hideRunButton?: boolean;
  onDeleteClick?: (scenarioId: string) => void;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  scenarios,
  onSelectScenario,
  selectedScenarioId,
  isLoading,
  hideRunButton = false,
  onDeleteClick
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">Select a simulation scenario:</h3>
      <div className="grid grid-cols-1 gap-3">
        {scenarios.map((scenario) => {
          const isSelected = selectedScenarioId === scenario.id;
          
          return (
            <div
              key={scenario.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected ? 'border-primary bg-primary/5' : 'hover:border-gray-400'
              }`}
              onClick={() => onSelectScenario(scenario.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{scenario.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{scenario.description}</p>
                </div>
                <div className="flex space-x-2">
                  {onDeleteClick && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(scenario.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  {isSelected && !hideRunButton && (
                    <Button
                      size="sm"
                      disabled={isLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectScenario(scenario.id);
                      }}
                    >
                      {isLoading ? (
                        <span>Loading...</span>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Run Simulation
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScenarioSelector;
