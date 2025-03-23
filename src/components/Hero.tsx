
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, FileCog } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({
  onGetStarted
}) => {
  return <div className="relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent opacity-70 pointer-events-none" />
      <div className="absolute top-20 -left-10 w-40 h-40 bg-primary opacity-10 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-10 w-60 h-60 bg-blue-400 opacity-10 rounded-full blur-3xl" />
      
      <div className="container px-4 py-20 md:py-32 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto animate-fade-up">
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Button size="lg" onClick={onGetStarted} className="text-base px-8 h-12 text-blue-500 bg-blue-300 hover:bg-blue-200">
              Analyze Your Document
              <FileCog className="ml-2 h-5 w-5" />
            </Button>
            
            <Button size="lg" variant="outline" className="text-base px-8 h-12">
              Learn More
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-primary" />
              GDPR Compliant
            </div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <div className="flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-primary" />
              HIPAA Ready
            </div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <div className="flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-primary" />
              SOC 2 Verified
            </div>
          </div>
        </div>
      </div>
    </div>;
};

export default Hero;
