
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';

const TrustedBySection: React.FC = () => {
  const industries = [
    {
      name: 'Finance',
      image: '/lovable-uploads/f617d74b-d314-4a7a-9e0b-bc6dbbbd227b.png',
      icon: '💼'
    },
    {
      name: 'Healthcare',
      image: '/lovable-uploads/f617d74b-d314-4a7a-9e0b-bc6dbbbd227b.png',
      icon: '🏥'
    },
    {
      name: 'E-commerce',
      image: '/lovable-uploads/f617d74b-d314-4a7a-9e0b-bc6dbbbd227b.png',
      icon: '🛒'
    },
    {
      name: 'SaaS & Startups',
      image: '/lovable-uploads/f617d74b-d314-4a7a-9e0b-bc6dbbbd227b.png',
      icon: '🚀'
    },
    {
      name: 'Government',
      image: '/lovable-uploads/f617d74b-d314-4a7a-9e0b-bc6dbbbd227b.png',
      icon: '🏛️'
    },
    {
      name: 'Manufacturing',
      image: '/lovable-uploads/f617d74b-d314-4a7a-9e0b-bc6dbbbd227b.png',
      icon: '⚙️'
    },
    {
      name: 'Insurance',
      image: '/lovable-uploads/f617d74b-d314-4a7a-9e0b-bc6dbbbd227b.png',
      icon: '🛡️'
    },
    {
      name: 'Telecommunications',
      image: '/lovable-uploads/f617d74b-d314-4a7a-9e0b-bc6dbbbd227b.png',
      icon: '📡'
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
                  <div className="text-white p-4 w-full">
                    <span className="text-xl mr-2">{industry.icon}</span>
                    <span className="font-medium">{industry.name}</span>
                  </div>
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
