
import React from 'react';
import PlanFeatures from './PlanFeatures';

interface PlansFeatureListProps {
  freeFeatures: string[];
  basicFeatures: string[];
  proFeatures: string[];
  enterpriseFeatures: string[];
}

const PlansFeatureList = ({
  freeFeatures,
  basicFeatures,
  proFeatures,
  enterpriseFeatures
}: PlansFeatureListProps) => {
  return (
    <div className="flex-1 bg-muted/30 p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">What you get</h3>
      
      <div className="space-y-6">
        <PlanFeatures 
          title="Free Plan" 
          features={freeFeatures} 
        />
        
        <PlanFeatures 
          title="Basic Plan" 
          price="$29/month" 
          features={basicFeatures} 
        />
        
        <PlanFeatures 
          title="Pro Plan" 
          price="$99/month" 
          features={proFeatures} 
        />
        
        <PlanFeatures 
          title="Enterprise Plan" 
          price="$299/month" 
          features={enterpriseFeatures} 
        />
      </div>
    </div>
  );
};

export default PlansFeatureList;
