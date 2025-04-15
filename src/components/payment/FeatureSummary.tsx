
import React from 'react';
import { Check } from 'lucide-react';
import FeatureList from '@/components/pricing/FeatureList';
import { 
  freeFeatures, 
  starterFeatures, 
  proFeatures, 
  enterpriseFeatures,
  pricing
} from '@/components/pricing/PricingData';
import { getPrice } from '@/utils/pricingData';

const FeatureSummary: React.FC = () => {
  // Always use monthly pricing for display
  const billingCycle = 'monthly';
  
  return (
    <div className="bg-muted/30 p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">What you get</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-primary mb-2">Free Plan</h4>
          <FeatureList features={freeFeatures} />
        </div>
        
        <div>
          <h4 className="font-medium text-primary mb-2">Starter Plan - ${pricing.starter.monthly}/month</h4>
          <FeatureList features={starterFeatures} />
        </div>
        
        <div>
          <h4 className="font-medium text-primary mb-2">Pro Plan - ${pricing.pro.monthly}/month</h4>
          <FeatureList features={proFeatures} />
        </div>
        
        <div>
          <h4 className="font-medium text-primary mb-2">Enterprise Plan - ${pricing.enterprise.monthly}/month</h4>
          <FeatureList features={enterpriseFeatures} />
        </div>
      </div>
    </div>
  );
};

export default FeatureSummary;
