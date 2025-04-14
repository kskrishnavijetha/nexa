
import React from 'react';
import IndustryCard from './industries/IndustryCard';
import IndustryFocusSection from './industries/IndustryFocusSection';
import { industries, focusIndustries } from './industries/industryData';

const IndustriesSection: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Industry-Specific Solutions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tailored compliance solutions for your industry's unique requirements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {industries.map((industry, index) => (
            <IndustryCard 
              key={index}
              name={industry.name}
              icon={industry.icon}
              features={industry.features}
            />
          ))}
        </div>
        
        {/* Industry focus sections */}
        {focusIndustries.map((industry, index) => (
          <IndustryFocusSection
            key={index}
            title={industry.title}
            description={industry.description}
            features={industry.features}
            imageSrc={industry.imageSrc}
            imageAlt={industry.imageAlt}
            reversed={index % 2 === 1}
          />
        ))}
      </div>
    </div>
  );
};

export default IndustriesSection;
