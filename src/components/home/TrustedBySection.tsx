
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Stethoscope, ShoppingBag, Rocket, Building, Factory, Shield, Wifi } from 'lucide-react';

const TrustedBySection: React.FC = () => {
  const industries = [
    { name: 'Finance', icon: <Briefcase className="h-6 w-6" /> },
    { name: 'Healthcare', icon: <Stethoscope className="h-6 w-6" /> }, 
    { name: 'E-commerce', icon: <ShoppingBag className="h-6 w-6" /> }, 
    { name: 'SaaS & Startups', icon: <Rocket className="h-6 w-6" /> },
    { name: 'Government', icon: <Building className="h-6 w-6" /> }, 
    { name: 'Manufacturing', icon: <Factory className="h-6 w-6" /> }, 
    { name: 'Insurance', icon: <Shield className="h-6 w-6" /> }, 
    { name: 'Telecommunications', icon: <Wifi className="h-6 w-6" /> }
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
              <CardContent className="p-4 flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {industry.icon}
                </div>
                <p className="font-medium text-gray-700">{industry.name}</p>
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
