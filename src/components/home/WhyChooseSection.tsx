
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FeatureItem from './why-choose/FeatureItem';
import { keyFeatures } from './why-choose/keyFeaturesData';

const WhyChooseSection: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Why Choose Nexabloom?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform delivers industry-leading compliance management with unmatched efficiency
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="space-y-6">
                {keyFeatures.map((feature, index) => (
                  <FeatureItem key={index} text={feature} />
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-xl font-bold text-primary">
                  100% Compliance, 90% Less Effort, 50% Lower Costs!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseSection;
