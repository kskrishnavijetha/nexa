
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Briefcase, Stethoscope, Building2, LandPlot, ShieldCheck, Factory, Truck } from 'lucide-react';

const industries = [
  {
    name: "Finance & Banking",
    icon: <Briefcase className="h-6 w-6" />,
    features: [
      "KYC & AML Compliance automation",
      "SOC 2 & PCI-DSS risk assessments",
      "Secure transaction monitoring"
    ]
  },
  {
    name: "Healthcare",
    icon: <Stethoscope className="h-6 w-6" />,
    features: [
      "AI-driven HIPAA compliance",
      "Medical data security & risk checks",
      "Automated reporting for audits"
    ]
  },
  {
    name: "Technology",
    icon: <Building2 className="h-6 w-6" />,
    features: [
      "SOC 2 & ISO 27001 readiness",
      "GDPR & CCPA compliance automation",
      "Cloud security & risk management"
    ]
  },
  {
    name: "Government",
    icon: <ShieldCheck className="h-6 w-6" />,
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
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    {industry.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-primary">{industry.name}</h3>
                </div>
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
