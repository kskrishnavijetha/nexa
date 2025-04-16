
import React from 'react';

interface FeatureItemProps {
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text }) => {
  // Split the text into title and description
  const parts = text.split(' - ');
  const title = parts[0];
  const description = parts.length > 1 ? parts[1] : '';

  return (
    <div className="flex items-start">
      <div className="flex-1">
        <p className="text-gray-900 text-lg font-semibold mb-1">{title}</p>
        {description && (
          <p className="text-gray-700">{description}</p>
        )}
      </div>
    </div>
  );
};

export default FeatureItem;
