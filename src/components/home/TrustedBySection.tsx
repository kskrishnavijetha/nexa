
import React from 'react';
import IndustryCard from './trusted/IndustryCard';
import { trustedIndustries } from './trusted/industriesData';

const TrustedBySection: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Trusted by Industry Leaders</h2>
          <p className="text-muted-foreground">
            Join over 1000+ organizations that trust our compliance solutions
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustedIndustries.map((industry, index) => (
            <IndustryCard 
              key={index} 
              name={industry.name}
              icon={industry.icon}
            />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-lg font-medium text-primary">
            Enterprise-Grade Security | AI-Powered | Always Up-to-Date
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustedBySection;
