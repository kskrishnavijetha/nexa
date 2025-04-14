
import React from 'react';
import FeatureCard from './features/FeatureCard';
import { complianceFeatures } from './features/featuresData';

const ComplianceFeaturesSection: React.FC = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Compliance Solutions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform provides end-to-end compliance management powered by advanced AI technology
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {complianceFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceFeaturesSection;
