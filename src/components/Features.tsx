
import React from 'react';
import FeatureCard from './feature-section/FeatureCard';
import { features } from './feature-section/featureData';

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-white" id="features">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl font-bold mb-4">
            Why Choose Our Compliance Tool?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform simplifies compliance verification with powerful features designed to save you time and reduce risk.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
