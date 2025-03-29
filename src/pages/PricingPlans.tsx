
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { hasActiveSubscription } from '@/utils/paymentService';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const PricingPlans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  // Apply 10% discount for annual billing
  const annualDiscount = 0.1; // 10% discount

  // All features available for all plans
  const allFeatures = [
    "GDPR, HIPAA, and SOC2 compliance checks",
    "Detailed risk analysis with severity ratings",
    "AI-powered recommendations",
    "Comprehensive compliance analysis for all regulations",
    "Custom compliance templates",
    "Downloadable PDF reports",
    "Email support"
  ];
  
  // Updated pricing
  const pricing = {
    free: {
      monthly: 0,
      annually: 0,
      scans: "1 scan per month"
    },
    basic: {
      monthly: 35,
      annually: Math.round(35 * 12 * (1 - annualDiscount)),
      scans: "10 scans per month"
    },
    pro: {
      monthly: 110,
      annually: Math.round(110 * 12 * (1 - annualDiscount)),
      scans: "50 scans per month"
    },
    enterprise: {
      monthly: 399,
      annually: Math.round(399 * 12 * (1 - annualDiscount)),
      scans: "Unlimited scans"
    }
  };

  const handleSelectPlan = (plan: string) => {
    if (!user) {
      navigate('/auth/signup');
    } else {
      navigate('/payment', { 
        state: { 
          selectedPlan: plan,
          billingCycle: billingCycle 
        }
      });
    }
  };

  const formatPrice = (price: number, cycle: 'monthly' | 'annually') => {
    if (price === 0) return "Free";
    return `$${price}${cycle === 'monthly' ? '/month' : '/year'}`;
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose the Right Plan for Your Compliance Needs</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Get started with our free plan or upgrade to premium features for comprehensive compliance coverage.
        </p>
        
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Label htmlFor="billing-cycle" className={billingCycle === 'monthly' ? 'font-semibold' : ''}>Monthly</Label>
            <Switch 
              id="billing-cycle" 
              checked={billingCycle === 'annually'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'annually' : 'monthly')}
            />
            <Label htmlFor="billing-cycle" className={billingCycle === 'annually' ? 'font-semibold' : ''}>
              Annually <span className="text-sm text-green-600 font-semibold">(Save 10%)</span>
            </Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Free Plan */}
        <Card className="flex flex-col border-border hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Get started with basic compliance checks</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">{formatPrice(pricing.free[billingCycle], billingCycle)}</span>
            </div>
            <div className="text-primary font-medium mt-2">
              {pricing.free.scans}
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {allFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleSelectPlan('free')}
            >
              {hasActiveSubscription() ? 'Change Plan' : 'Get Started'}
            </Button>
          </CardFooter>
        </Card>

        {/* Basic Plan */}
        <Card className="flex flex-col border-border hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Basic</CardTitle>
            <CardDescription>Essential compliance tools for small businesses</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">{formatPrice(pricing.basic[billingCycle], billingCycle)}</span>
            </div>
            <div className="text-primary font-medium mt-2">
              {pricing.basic.scans}
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {allFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => handleSelectPlan('basic')}
            >
              {hasActiveSubscription() ? 'Change Plan' : 'Subscribe'}
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan - Highlighted as recommended */}
        <Card className="flex flex-col border-primary bg-primary/5 hover:bg-primary/10 transition-colors">
          <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
            Recommended
          </div>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>Advanced compliance for growing organizations</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">{formatPrice(pricing.pro[billingCycle], billingCycle)}</span>
            </div>
            <div className="text-primary font-medium mt-2">
              {pricing.pro.scans}
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {allFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => handleSelectPlan('pro')}
            >
              {hasActiveSubscription() ? 'Change Plan' : 'Subscribe'}
            </Button>
          </CardFooter>
        </Card>

        {/* Enterprise Plan */}
        <Card className="flex flex-col border-border hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>Complete compliance solution for large enterprises</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">{formatPrice(pricing.enterprise[billingCycle], billingCycle)}</span>
            </div>
            <div className="text-primary font-medium mt-2">
              {pricing.enterprise.scans}
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {allFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => handleSelectPlan('enterprise')}
            >
              {hasActiveSubscription() ? 'Change Plan' : 'Subscribe'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PricingPlans;
