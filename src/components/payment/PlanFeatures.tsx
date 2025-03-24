
import React from 'react';
import { Check } from 'lucide-react';

interface PlanFeaturesProps {
  title: string;
  price?: string;
  features: string[];
}

const PlanFeatures = ({ title, price, features }: PlanFeaturesProps) => {
  return (
    <div>
      <h4 className="font-medium text-primary mb-2">
        {title}{price && ` - ${price}`}
      </h4>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="rounded-full bg-primary/10 p-1 mt-0.5">
              <Check className="h-3 w-3 text-primary" />
            </div>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanFeatures;
