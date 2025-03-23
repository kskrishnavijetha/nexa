
import React from 'react';
import { Shield, FileText, ShieldAlert, Brain } from 'lucide-react';

const ComplianceFeatures: React.FC = () => {
  const features = [
    {
      icon: <ShieldAlert className="h-10 w-10 text-purple-500" />,
      title: "Risk Detection & Alerts",
      description: "AI finds compliance gaps & sends alerts"
    },
    {
      icon: <FileText className="h-10 w-10 text-blue-500" />,
      title: "Automated Reporting",
      description: "AI generates reports & audit logs"
    },
    {
      icon: <Shield className="h-10 w-10 text-green-500" />,
      title: "Enforcement Actions",
      description: "AI blocks risky actions & suggests fixes"
    },
    {
      icon: <Brain className="h-10 w-10 text-orange-500" />,
      title: "Continuous Learning",
      description: "AI keeps updating based on new laws"
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">AI-Powered Compliance Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our intelligent platform automates compliance processes with advanced AI technology
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-primary/20"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComplianceFeatures;
