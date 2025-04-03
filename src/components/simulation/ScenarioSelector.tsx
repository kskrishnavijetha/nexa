
import React from 'react';
import { SimulationScenario } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { PlayCircle, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ScenarioSelectorProps {
  scenarios: SimulationScenario[];
  onSelectScenario: (scenarioId: string) => void;
  onDeleteClick?: (scenarioId: string) => void;
  selectedScenarioId?: string;
  isLoading?: boolean;
  hideRunButton?: boolean;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  scenarios,
  onSelectScenario,
  onDeleteClick,
  selectedScenarioId,
  isLoading = false,
  hideRunButton = false
}) => {
  console.log("ScenarioSelector received scenarios:", scenarios);
  
  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="text-center p-6 border rounded-lg">
        <p className="text-muted-foreground">No simulation scenarios available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Select a simulation scenario:</h3>
      <div className="space-y-3">
        {scenarios.map((scenario) => (
          <div 
            key={scenario.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedScenarioId === scenario.id 
                ? 'border-primary/50 bg-primary/5' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onSelectScenario(scenario.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{scenario.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{scenario.description}</p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {scenario.regulationChanges && scenario.regulationChanges.map((change, idx) => (
                    <Badge 
                      key={idx}
                      variant="outline" 
                      className={`text-xs ${
                        change.impactLevel === 'high' 
                          ? 'border-red-200 bg-red-50 text-red-700' 
                          : change.impactLevel === 'medium' 
                          ? 'border-amber-200 bg-amber-50 text-amber-700' 
                          : 'border-blue-200 bg-blue-50 text-blue-700'
                      }`}
                    >
                      {change.regulation} - {change.changeType}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {!hideRunButton && selectedScenarioId === scenario.id && (
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    disabled={isLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectScenario(scenario.id);
                    }}
                  >
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Run
                  </Button>
                  
                  {onDeleteClick && (
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(scenario.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScenarioSelector;
