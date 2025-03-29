
import React from 'react';
import { Check } from 'lucide-react';

interface FeatureListProps {
  features: string[];
  highlight?: boolean;
}

const FeatureList: React.FC<FeatureListProps> = ({ features, highlight = false }) => {
  return (
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2">
          <div className={`rounded-full ${highlight ? 'bg-primary/20' : 'bg-primary/10'} p-1 mt-0.5`}>
            <Check className="h-3 w-3 text-primary" />
          </div>
          <span className="text-sm">{feature}</span>
        </li>
      ))}
    </ul>
  );
};

export default FeatureList;
