
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface IndustryFocusSectionProps {
  title: string;
  description: string;
  features: string[];
  imageSrc: string;
  imageAlt: string;
  reversed?: boolean;
}

const IndustryFocusSection: React.FC<IndustryFocusSectionProps> = ({
  title,
  description,
  features,
  imageSrc,
  imageAlt,
  reversed = false
}) => {
  return (
    <div className="mt-8 bg-white p-8 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className={`md:w-1/2 flex justify-center order-2 ${reversed ? 'md:order-1' : 'md:order-2'}`}>
          <div className="rounded-lg overflow-hidden shadow-md">
            <img 
              src={imageSrc} 
              alt={imageAlt} 
              className="w-full h-auto object-cover"
              style={{ maxHeight: '300px' }}
            />
          </div>
        </div>
        <div className={`md:w-1/2 order-1 ${reversed ? 'md:order-2' : 'md:order-1'}`}>
          <h3 className="text-2xl font-bold mb-4 text-primary">{title}</h3>
          <p className="mb-4 text-gray-700">{description}</p>
          <ul className="space-y-3">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IndustryFocusSection;
