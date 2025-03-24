
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center">
      <p className="text-sm font-medium text-primary mb-2">Trusted by 1000+ companies</p>
      <h1 className="font-bold mb-2 text-5xl md:text-6xl text-gray-900">
        🚀 CompliZen
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
        AI-Powered Compliance Automation
      </h2>
      <p className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
        Effortless Compliance. Maximum Security. Zero Hassle.
      </p>
      <p className="text-muted-foreground mb-8 text-lg">
        📌 Stay ahead of regulations like GDPR, HIPAA, SOC 2, and PCI-DSS with AI-driven automation. 
        Reduce compliance costs, minimize risks, and ensure full regulatory alignment—without the manual effort.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
        <Button size="lg" className="px-8" onClick={() => {
          navigate('/document-analysis');
          console.log("Upload clicked");
        }}>
          Upload Document
        </Button>
        <Button variant="outline" size="lg" onClick={() => {
          navigate('/payment');
        }}>
          Pricing Plans
        </Button>
      </div>
    </div>
  );
};

export default Hero;
