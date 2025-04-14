
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';

const TrustedBySection: React.FC = () => {
  const industries = [
    {
      name: 'Finance',
      image: '/assets/images/industries/finance.jpg'
    },
    {
      name: 'Healthcare',
      image: '/assets/images/industries/healthcare.jpg'
    },
    {
      name: 'E-commerce',
      image: '/assets/images/industries/ecommerce.jpg'
    },
    {
      name: 'SaaS & Startups',
      image: '/assets/images/industries/saas.jpg'
    },
    {
      name: 'Government',
      image: '/assets/images/industries/government.jpg'
    },
    {
      name: 'Manufacturing',
      image: '/assets/images/industries/manufacturing.jpg'
    },
    {
      name: 'Insurance',
      image: '/assets/images/industries/insurance.jpg'
    },
    {
      name: 'Telecommunications',
      image: '/assets/images/industries/telecommunications.jpg'
    }
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-40 relative overflow-hidden">
                <img 
                  src={industry.image} 
                  alt={`${industry.name} industry`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <p className="text-white font-medium p-4 w-full text-center">{industry.name}</p>
                </div>
              </div>
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
