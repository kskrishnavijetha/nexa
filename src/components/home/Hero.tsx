
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="text-center py-16">
      <p className="text-sm font-medium text-primary mb-2">Trusted by 1000+ companies</p>
      <div className="flex items-center justify-center mb-4">
        <img src="/lovable-uploads/98b02f48-a016-4320-8250-41f72b8497ca.png" alt="Nexabloom Logo" className="h-16 w-16" />
        <h1 className="font-bold text-5xl md:text-6xl text-gray-900 ml-2">
          Nexabloom
        </h1>
      </div>
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
      
      <div className="flex justify-center mb-12">
        <Button 
          size="lg" 
          className="px-8 py-6 text-lg bg-[#1A8DE0] hover:bg-[#0E6CBD]"
          onClick={() => {
            if (user) {
              navigate('/dashboard');
            } else {
              navigate('/sign-up');
            }
          }}
        >
          {user ? 'Go to Dashboard' : 'Get Started Now'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Hero;
