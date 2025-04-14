
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-bold">Basic</h2>
          <p className="text-3xl font-bold mt-2">$9.99</p>
          <p className="text-sm text-muted-foreground">per month</p>
          <Button className="mt-4 w-full" onClick={() => navigate('/payment')}>
            Subscribe
          </Button>
        </div>
        <div className="border p-6 rounded-lg bg-primary/5">
          <h2 className="text-xl font-bold">Pro</h2>
          <p className="text-3xl font-bold mt-2">$29.99</p>
          <p className="text-sm text-muted-foreground">per month</p>
          <Button className="mt-4 w-full" onClick={() => navigate('/payment')}>
            Subscribe
          </Button>
        </div>
        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-bold">Enterprise</h2>
          <p className="text-3xl font-bold mt-2">$99.99</p>
          <p className="text-sm text-muted-foreground">per month</p>
          <Button className="mt-4 w-full" onClick={() => navigate('/payment')}>
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
