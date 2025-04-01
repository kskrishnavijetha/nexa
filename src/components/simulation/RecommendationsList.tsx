
import React from 'react';
import { CheckCircle2, Shield } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: string[];
}

// Helper function to categorize recommendations
const categorizeRecommendations = (recommendations: string[]) => {
  const categories: Record<string, string[]> = {
    'GDPR': [],
    'HIPAA': [],
    'SOC 2': [],
    'PCI DSS': [],
    'Other': []
  };

  recommendations.forEach(recommendation => {
    if (recommendation.includes('GDPR') || recommendation.includes('data protection') || recommendation.includes('privacy')) {
      categories['GDPR'].push(recommendation);
    } else if (recommendation.includes('HIPAA') || recommendation.includes('PHI') || recommendation.includes('health')) {
      categories['HIPAA'].push(recommendation);
    } else if (recommendation.includes('SOC 2') || recommendation.includes('security controls') || recommendation.includes('audit')) {
      categories['SOC 2'].push(recommendation);
    } else if (recommendation.includes('PCI') || recommendation.includes('cardholder') || recommendation.includes('payment')) {
      categories['PCI DSS'].push(recommendation);
    } else {
      categories['Other'].push(recommendation);
    }
  });

  // Remove empty categories
  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
};

const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No recommendations available for this scenario</p>
      </div>
    );
  }

  const categories = categorizeRecommendations(recommendations);

  return (
    <div className="space-y-6">
      {Object.entries(categories).map(([category, items]) => (
        <div key={category} className="space-y-3">
          {category !== 'Other' && (
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">{category} Recommendations</h3>
            </div>
          )}
          
          {items.map((recommendation, index) => (
            <div key={index} className="flex items-start bg-background/50 p-3 rounded-md border">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm">{recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RecommendationsList;
