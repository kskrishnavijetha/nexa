
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: string[];
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  return (
    <div className="space-y-3">
      {recommendations.map((recommendation, index) => (
        <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
          <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">{recommendation}</p>
        </div>
      ))}
    </div>
  );
};

export default RecommendationsList;
