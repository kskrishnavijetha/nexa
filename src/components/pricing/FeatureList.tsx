
import React from 'react';
import { Check } from 'lucide-react';

interface FeatureListProps {
  features: string[];
}

const FeatureList: React.FC<FeatureListProps> = ({ features }) => {
  return (
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-sm">
          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
  );
};

export default FeatureList;
