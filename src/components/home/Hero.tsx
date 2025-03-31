
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
      <div className="flex justify-center items-center mb-2">
        <img 
          src="/public/lovable-uploads/b96b3f45-8a1a-40d5-b884-1142753be402.png" 
          alt="CompliZen Logo" 
          className="h-16 w-16 mr-2"
          style={{ backgroundColor: 'transparent' }}
        />
        <h1 className="font-bold text-5xl md:text-6xl text-gray-900">
          CompliZen
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
          className="px-8 py-6 text-lg bg-[#8B5CF6] hover:bg-[#7c4af0]"
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
