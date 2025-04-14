
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const HeroContent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto text-center px-4">
      <div className="flex items-center justify-center mb-6">
        <img 
          src="/lovable-uploads/02ec954b-2d1e-4c5c-bfbd-f06f37b0329d.png" 
          alt="Nexabloom Logo" 
          className="h-16 w-16 object-contain" 
        />
        <h1 className="font-bold text-4xl md:text-6xl text-gray-900 ml-2">
          Nexabloom
        </h1>
      </div>
      
      <h2 className="text-xl md:text-3xl font-semibold text-primary mb-6">
        AI-Powered Compliance Automation Platform
      </h2>
      
      <p className="text-xl font-medium text-gray-800 mb-4 max-w-3xl mx-auto">
        Streamline regulatory compliance with our intelligent AI technology
      </p>
      
      <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
        Stay ahead of regulations like GDPR, HIPAA, SOC 2, and PCI-DSS with automation 
        that reduces costs, minimizes risks, and ensures full regulatory alignment.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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
        
        <Button 
          size="lg" 
          variant="outline"
          className="px-8 py-6 text-lg"
          onClick={() => navigate('/pricing')}
        >
          View Pricing
          <Shield className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default HeroContent;
