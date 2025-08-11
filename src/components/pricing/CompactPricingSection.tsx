
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompactPricingSection: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Basic compliance checks',
      features: ['5 document scans/month', 'Basic compliance analysis', 'Email support'],
      buttonText: 'Get Started',
      variant: 'outline' as const
    },
    {
      name: 'Starter',
      price: '$29',
      description: 'Essential compliance tools',
      features: ['20 document scans/month', 'PDF reports', 'Priority support'],
      buttonText: 'Choose Starter',
      variant: 'default' as const,
      popular: true
    },
    {
      name: 'Pro',
      price: '$79',
      description: 'Advanced compliance features',
      features: ['Unlimited scans', 'Advanced analysis', 'API access'],
      buttonText: 'Choose Pro',
      variant: 'default' as const
    }
  ];

  const handleSelectPlan = (planName: string) => {
    navigate('/pricing');
  };

  return (
    <div className="mt-8 p-6 bg-muted/30 rounded-lg">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Choose Your Plan</h3>
        <p className="text-muted-foreground">Select a plan that fits your compliance needs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  Popular
                </span>
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="text-2xl font-bold">{plan.price}<span className="text-sm font-normal">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                variant={plan.variant} 
                className="w-full" 
                onClick={() => handleSelectPlan(plan.name)}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <Button variant="link" onClick={() => navigate('/pricing')}>
          View detailed pricing →
        </Button>
      </div>
    </div>
  );
};

export default CompactPricingSection;
