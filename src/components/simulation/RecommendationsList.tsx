
import React from 'react';
import { PredictiveAnalysis } from '@/utils/types';

interface RecommendationsListProps {
  recommendations: string[];
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  return (
    <div className="space-y-2">
      {recommendations.map((recommendation, index) => (
        <div key={index} className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
          <p className="text-sm">{recommendation}</p>
        </div>
      ))}
    </div>
  );
};

export default RecommendationsList;
