
import React from 'react';
import { SimulationScenario } from '@/utils/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Radar, GitCompare, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScenarioSelectorProps {
  scenarios: SimulationScenario[];
  onSelectScenario: (scenarioId: string) => void;
  isLoading: boolean;
  selectedScenarioId?: string;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  scenarios,
  onSelectScenario,
  isLoading,
  selectedScenarioId
}) => {
  // Get an icon based on scenario id
  const getScenarioIcon = (scenarioId: string) => {
    if (scenarioId.includes('gdpr')) return <Shield className="h-5 w-5 text-blue-500" />;
    if (scenarioId.includes('hipaa')) return <Shield className="h-5 w-5 text-green-500" />;
    if (scenarioId.includes('financial')) return <Shield className="h-5 w-5 text-yellow-500" />;
    if (scenarioId.includes('tech')) return <Radar className="h-5 w-5 text-purple-500" />;
    if (scenarioId.includes('multi')) return <GitCompare className="h-5 w-5 text-indigo-500" />;
    return <AlertTriangle className="h-5 w-5 text-orange-500" />;
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Select Simulation Scenario</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <Card 
            key={scenario.id} 
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              selectedScenarioId === scenario.id ? 'border-2 border-primary' : ''
            }`}
            onClick={() => !isLoading && onSelectScenario(scenario.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getScenarioIcon(scenario.id)}
                  <CardTitle className="text-base ml-2">{scenario.name}</CardTitle>
                </div>
                {selectedScenarioId === scenario.id && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs">{scenario.description}</CardDescription>
              <div className="mt-3">
                <p className="text-xs font-medium">Affected Regulations:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {scenario.regulationChanges.map((change, index) => (
                    <span 
                      key={index}
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        change.impactLevel === 'high' ? 'bg-red-100 text-red-800' :
                        change.impactLevel === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {change.regulation}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedScenarioId && (
        <div className="mt-4">
          <Button 
            onClick={() => onSelectScenario(selectedScenarioId)} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Running Simulation...' : 'Run Simulation Analysis'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScenarioSelector;
