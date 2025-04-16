
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FeatureItem from './why-choose/FeatureItem';
import { keyFeatures } from './why-choose/keyFeaturesData';
import { SearchIcon, Briefcase } from 'lucide-react';

const WhyChooseSection: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">💼 Why Choose NexaBloom?</h2>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Our platform delivers industry-leading compliance management with unmatched efficiency
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-md">
            <CardContent className="p-8">
              <div className="space-y-6">
                {keyFeatures.map((feature, index) => (
                  <FeatureItem key={index} text={feature} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseSection;
