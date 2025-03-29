
import React, { useState } from 'react';
import { ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const benefits = [
  {
    title: "Reduce Compliance Costs by 50%",
    description: "Our AI automation reduces the need for expensive compliance consultants and manual audits."
  },
  {
    title: "Cut Manual Work by 90%",
    description: "Automated document scanning, risk detection, and report generation save countless hours of tedious work."
  },
  {
    title: "Achieve Faster Compliance in Minutes, Not Days and Months",
    description: "What used to take weeks can now be completed in minutes with our AI-powered compliance tools."
  }
];

const ResultsSection: React.FC = () => {
  const [expandedBenefit, setExpandedBenefit] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleBenefit = (index: number) => {
    setExpandedBenefit(expandedBenefit === index ? null : index);
  };

  const handleTryFeature = () => {
    if (user) {
      navigate('/document-analysis');
    } else {
      navigate('/sign-up');
    }
  };

  return (
    <div className="my-16 bg-primary/5 p-8 rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">📈 Results with CompliZen</h2>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Our customers achieve significant improvements in their compliance processes. Here's what you can expect:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {benefits.map((benefit, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-lg shadow-sm border transition-all duration-300 hover:shadow-md"
          >
            <div className="text-4xl text-primary mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">{benefit.title}</h3>
            
            {expandedBenefit === index && (
              <p className="text-muted-foreground mb-4">{benefit.description}</p>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-primary"
              onClick={() => toggleBenefit(index)}
            >
              {expandedBenefit === index ? "Show less" : "Learn more"} 
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${expandedBenefit === index ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <Button 
          variant="default"
          size="lg" 
          className="bg-primary hover:bg-primary/90"
          onClick={handleTryFeature}
        >
          Try It Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ResultsSection;
