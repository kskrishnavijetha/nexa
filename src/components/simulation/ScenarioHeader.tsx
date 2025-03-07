
import React from 'react';
import { PredictiveAnalysis } from '@/utils/types';
import { ArrowRight } from 'lucide-react';

interface ScenarioHeaderProps {
  analysis: PredictiveAnalysis;
}

const ScenarioHeader: React.FC<ScenarioHeaderProps> = ({ analysis }) => {
  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Scenario: {analysis.scenarioName}</h3>
      <p className="text-sm text-slate-600">{analysis.scenarioDescription}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {analysis.regulationChanges.map((change, index) => (
          <div 
            key={index} 
            className="flex items-center text-xs bg-white rounded-full px-3 py-1 border"
          >
            <span className="font-medium">{change.regulation}</span>
            <ArrowRight className="h-3 w-3 mx-1" />
            <span className={`${
              change.changeType === 'stricter' || change.changeType === 'new' 
                ? 'text-red-600' 
                : change.changeType === 'relaxed' 
                  ? 'text-green-600' 
                  : 'text-blue-600'
            }`}>
              {change.changeType}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScenarioHeader;
