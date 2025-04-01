
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: string[];
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No recommendations available for this scenario</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recommendations.map((recommendation, index) => (
        <div key={index} className="flex items-start bg-background/50 p-3 rounded-md border">
          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm">{recommendation}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendationsList;
