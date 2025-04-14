
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TrustedBySection: React.FC = () => {
  const industries = [
    'Finance', 'Healthcare', 'E-commerce', 'SaaS & Startups',
    'Government', 'Manufacturing', 'Insurance', 'Telecommunications'
  ];

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
          {industries.map((industry, index) => (
            <Card key={index} className="border-0 shadow-sm bg-white">
              <CardContent className="p-4 text-center">
                <p className="font-medium text-gray-700">{industry}</p>
              </CardContent>
            </Card>
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
