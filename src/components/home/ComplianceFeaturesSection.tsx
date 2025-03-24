
import React from 'react';
import { Check, Rocket, Award, BarChart } from 'lucide-react';

const complianceFeatures = [
  {
    icon: <Check className="h-6 w-6 text-primary" />,
    title: "Risk Detection & Alerts",
    description: "AI finds compliance gaps & sends alerts"
  },
  {
    icon: <Award className="h-6 w-6 text-primary" />,
    title: "Automated Reporting",
    description: "AI generates reports & audit logs"
  },
  {
    icon: <BarChart className="h-6 w-6 text-primary" />,
    title: "Enforcement Actions",
    description: "AI blocks risky actions & suggests fixes"
  },
  {
    icon: <Rocket className="h-6 w-6 text-primary" />,
    title: "Continuous Learning",
    description: "AI keeps updating based on new laws"
  }
];

const ComplianceFeaturesSection: React.FC = () => {
  return (
    <div className="my-16 bg-gray-50 p-8 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complianceFeatures.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceFeaturesSection;
