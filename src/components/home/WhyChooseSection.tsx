
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const keyFeatures = [
  "AI-Powered Compliance Audits – Identify risks, missing policies & compliance gaps instantly.",
  "Automated Policy Generation – Generate & update compliance documents tailored to your industry.",
  "Real-Time Risk Monitoring – Get alerts before compliance violations happen.",
  "Smart Compliance Reporting – Auto-generate reports for regulators & audits.",
  "Seamless Integrations – Works with AWS, Azure, Salesforce, and more."
];

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
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-4 shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-lg">{feature}</p>
                  </div>
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
