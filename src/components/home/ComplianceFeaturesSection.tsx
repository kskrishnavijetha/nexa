
import React from 'react';
import { Check, Rocket, Award, BarChart, Shield, Clock } from 'lucide-react';

const complianceFeatures = [
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Risk Detection & Alerts",
    description: "Our AI automatically identifies compliance gaps and sends real-time alerts to your team"
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: "Automated Reporting",
    description: "Generate comprehensive compliance reports and audit logs with a single click"
  },
  {
    icon: <BarChart className="h-10 w-10 text-primary" />,
    title: "Enforcement Actions",
    description: "Proactively block risky actions and suggest compliant alternatives"
  },
  {
    icon: <Rocket className="h-10 w-10 text-primary" />,
    title: "Continuous Learning",
    description: "Our system continuously adapts to new regulations and compliance requirements"
  },
  {
    icon: <Check className="h-10 w-10 text-primary" />,
    title: "Policy Generation",
    description: "Create tailored compliance policies that meet your specific industry requirements"
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: "Real-Time Monitoring",
    description: "Monitor your compliance status in real-time across all your systems and processes"
  }
];

const ComplianceFeaturesSection: React.FC = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Compliance Solutions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform provides end-to-end compliance management powered by advanced AI technology
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {complianceFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm border transition-all hover:shadow-md"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceFeaturesSection;
