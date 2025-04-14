
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Flexible Pricing Plans</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that works best for your compliance needs.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Basic Plan */}
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="p-6">
            <h3 className="text-xl font-semibold">Basic</h3>
            <div className="mt-4 text-3xl font-bold">$29<span className="text-lg text-muted-foreground font-normal">/month</span></div>
            <p className="mt-2 text-muted-foreground">For individuals and small teams</p>
            
            <ul className="mt-6 space-y-3">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>5 documents per month</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Basic risk assessment</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>PDF exports</span>
              </li>
            </ul>
          </div>
          
          <div className="p-6 bg-muted/50">
            <Button asChild className="w-full">
              <Link to="/payment?plan=basic">Choose Basic</Link>
            </Button>
          </div>
        </div>
        
        {/* Professional Plan */}
        <div className="border rounded-lg overflow-hidden shadow-sm relative">
          <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs rounded-bl-lg">
            Popular
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold">Professional</h3>
            <div className="mt-4 text-3xl font-bold">$99<span className="text-lg text-muted-foreground font-normal">/month</span></div>
            <p className="mt-2 text-muted-foreground">For growing businesses</p>
            
            <ul className="mt-6 space-y-3">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>25 documents per month</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Advanced risk assessment</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Audit-ready reports</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Email notifications</span>
              </li>
            </ul>
          </div>
          
          <div className="p-6 bg-muted/50">
            <Button asChild className="w-full" variant="default">
              <Link to="/payment?plan=professional">Choose Professional</Link>
            </Button>
          </div>
        </div>
        
        {/* Enterprise Plan */}
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="p-6">
            <h3 className="text-xl font-semibold">Enterprise</h3>
            <div className="mt-4 text-3xl font-bold">$299<span className="text-lg text-muted-foreground font-normal">/month</span></div>
            <p className="mt-2 text-muted-foreground">For large organizations</p>
            
            <ul className="mt-6 space-y-3">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Unlimited documents</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Custom compliance rules</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>API access</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Dedicated support</span>
              </li>
            </ul>
          </div>
          
          <div className="p-6 bg-muted/50">
            <Button asChild className="w-full" variant="outline">
              <Link to="/payment?plan=enterprise">Choose Enterprise</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">Need a custom solution?</p>
        <Button variant="outline">Contact Sales</Button>
      </div>
    </div>
  );
};

export default Pricing;
