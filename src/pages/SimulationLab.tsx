
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { PlayCircle, BarChart3, TrendingDown, AlertTriangle } from 'lucide-react';

const SimulationLab = () => {
  const [scenario, setScenario] = useState('');
  const [riskLevel, setRiskLevel] = useState([50]);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Simulation Lab</h1>
        <p className="text-gray-600 mt-2">Run what-if scenarios to predict compliance outcomes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Configuration</CardTitle>
              <CardDescription>
                Set up your simulation parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Scenario Type</label>
                <Select value={scenario} onValueChange={setScenario}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="data-breach">Data Breach Response</SelectItem>
                    <SelectItem value="regulation-change">New Regulation Impact</SelectItem>
                    <SelectItem value="audit-failure">Failed Audit Recovery</SelectItem>
                    <SelectItem value="policy-gap">Policy Gap Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Risk Severity: {riskLevel[0]}%
                </label>
                <Slider
                  value={riskLevel}
                  onValueChange={setRiskLevel}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <Button 
                onClick={runSimulation} 
                className="w-full" 
                disabled={!scenario || isRunning}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Simulation'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
              <CardDescription>
                Predicted outcomes and impact analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!scenario ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a scenario to run simulation</p>
                </div>
              ) : isRunning ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Running simulation...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-900">Potential Fine</span>
                    </div>
                    <p className="text-2xl font-bold text-red-900">$125,000</p>
                    <p className="text-sm text-red-700">Estimated penalty</p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Compliance Score</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-900">-15%</p>
                    <p className="text-sm text-yellow-700">Impact on overall score</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Recovery Time</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">30 days</p>
                    <p className="text-sm text-blue-700">Estimated remediation</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimulationLab;
