
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface FeatureItemProps {
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text }) => {
  return (
    <div className="flex items-start">
      <CheckCircle className="h-6 w-6 text-green-500 mr-4 shrink-0 mt-0.5" />
      <p className="text-gray-700 text-lg">{text}</p>
    </div>
  );
};

export default FeatureItem;
