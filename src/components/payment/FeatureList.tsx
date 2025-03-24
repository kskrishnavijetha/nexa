
import React from 'react';
import { Check } from 'lucide-react';
import { tierFeatures } from './PricingTiers';

const FeatureList = () => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-primary mb-2">Free Plan</h4>
        <ul className="space-y-2">
          {tierFeatures.free.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="font-medium text-primary mb-2">Basic Plan - $29/month</h4>
        <ul className="space-y-2">
          {tierFeatures.basic.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="font-medium text-primary mb-2">Pro Plan - $99/month</h4>
        <ul className="space-y-2">
          {tierFeatures.pro.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="font-medium text-primary mb-2">Enterprise Plan - $299/month</h4>
        <ul className="space-y-2">
          {tierFeatures.enterprise.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeatureList;
