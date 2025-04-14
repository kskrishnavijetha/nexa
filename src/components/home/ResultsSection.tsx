
import React from 'react';
import BenefitCard from './results/BenefitCard';
import { benefits } from './results/benefitsData';

const ResultsSection: React.FC = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Results with Nexabloom</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our customers achieve significant improvements in their compliance processes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              details={benefit.details}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
