
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const industries = [
  {
    name: "Finance & Banking",
    icon: "💼",
    image: "/lovable-uploads/f617d74b-d314-4a7a-9e0b-bc6dbbbd227b.png",
    features: [
      "KYC & AML Compliance automation",
      "SOC 2 & PCI-DSS risk assessments",
      "Secure transaction monitoring"
    ]
  },
  {
    name: "Healthcare",
    icon: "🏥",
    image: "/lovable-uploads/f617d74b-d314-4a7a-9e0b-bc6dbbbd227b.png",
    features: [
      "AI-driven HIPAA compliance",
      "Medical data security & risk checks",
      "Automated reporting for audits"
    ]
  },
  {
    name: "Technology",
    icon: "🚀",
    image: "/lovable-uploads/f617d74b-d314-4a7a-9e0b-bc6dbbbd227b.png",
    features: [
      "SOC 2 & ISO 27001 readiness",
      "GDPR & CCPA compliance automation",
      "Cloud security & risk management"
    ]
  },
  {
    name: "Government",
    icon: "🏛️",
    image: "/lovable-uploads/f617d74b-d314-4a7a-9e0b-bc6dbbbd227b.png",
    features: [
      "FISMA compliance automation",
      "Classified information handling",
      "Records management compliance"
    ]
  }
];

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
            <Card key={index} className="hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-32 relative overflow-hidden">
                <img 
                  src={industry.image} 
                  alt={`${industry.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-xl font-semibold mb-2 text-white p-4 flex items-center">
                    <span className="mr-2">{industry.icon}</span>
                    {industry.name}
                  </h3>
                </div>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {industry.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndustriesSection;
