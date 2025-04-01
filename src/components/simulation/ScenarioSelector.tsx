
import React from 'react';
import { SimulationScenario } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Play, Trash2 } from 'lucide-react';

interface ScenarioSelectorProps {
  scenarios: SimulationScenario[];
  onSelectScenario: (scenarioId: string) => void;
  isLoading: boolean;
  selectedScenarioId?: string;
  hideRunButton?: boolean;
  onDeleteClick?: (scenarioId: string) => void;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ 
  scenarios, 
  onSelectScenario, 
  isLoading, 
  selectedScenarioId,
  hideRunButton = false,
  onDeleteClick
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Select a Compliance Scenario</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {scenarios.map((scenario) => (
          <div 
            key={scenario.id} 
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedScenarioId === scenario.id 
                ? 'border-primary/70 bg-primary/5' 
                : 'border-border hover:border-primary/30'
            }`}
            onClick={() => !isLoading && onSelectScenario(scenario.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-base mb-1">{scenario.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{scenario.description}</p>
                
                <div className="text-xs text-muted-foreground mb-3">
                  {scenario.industry && (
                    <span className="inline-flex items-center px-2 py-1 mr-2 mb-1 rounded-full bg-primary/10 text-primary">
                      {scenario.industry}
                    </span>
                  )}
                  {scenario.regulationChanges.map((change, index) => (
                    <span 
                      key={index} 
                      className={`inline-flex items-center px-2 py-1 mr-2 mb-1 rounded-full 
                        ${change.impactLevel === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                          : change.impactLevel === 'medium' 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                    >
                      {change.regulation}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex ml-4">
                {!hideRunButton && selectedScenarioId === scenario.id && (
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectScenario(scenario.id);
                    }}
                    disabled={isLoading}
                    className="flex items-center"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </Button>
                )}
                
                {onDeleteClick && (
                  <Button
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick(scenario.id);
                    }}
                    className="text-muted-foreground hover:text-destructive ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {selectedScenarioId === scenario.id && (
              <div className="mt-4 pt-4 border-t text-sm">
                <h5 className="font-medium mb-2">Expected Regulatory Impact</h5>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {scenario.actions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {scenarios.length === 0 && (
        <div className="p-6 text-center border rounded-lg">
          <p className="text-muted-foreground">No scenarios available for this industry</p>
        </div>
      )}
    </div>
  );
};

export default ScenarioSelector;
