
import React from 'react';
import { Shield, Search, BarChart4, FileCheck } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: 'Document Analysis',
      description: 'Upload your documents and let our AI analyze them for compliance issues across multiple regulations.'
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: 'Risk Identification',
      description: 'Automatically identify compliance risks and receive detailed reports on potential vulnerabilities.'
    },
    {
      icon: <BarChart4 className="h-10 w-10 text-primary" />,
      title: 'Predictive Analytics',
      description: 'Get ahead of compliance issues with our predictive analytics that forecast potential future risks.'
    },
    {
      icon: <FileCheck className="h-10 w-10 text-primary" />,
      title: 'Remediation Guidance',
      description: 'Receive actionable recommendations to address compliance issues and improve your security posture.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform simplifies compliance verification in just a few easy steps, helping you stay compliant with regulations like GDPR, HIPAA, SOC 2, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="mb-4 p-3 bg-primary/10 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              <div className="mt-4 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
