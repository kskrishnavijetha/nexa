
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LifetimeOfferBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center">
                <span className="text-3xl mr-2">📝</span> 
                Limited Lifetime Offer
              </h3>
              
              <p className="text-lg mb-4">
                Get full access to NexaBloom's AI-powered compliance engine — smart scans, risk detection, 
                audit trails, alerts & PDF reports — for life.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start">
                  <span className="text-yellow-300 mr-2">💼</span>
                  <p>Only 30 founders & teams will get this one-time $999 deal. 
                  No subscriptions. No renewals. Just lifetime value.</p>
                </div>
                
                <div className="flex items-start">
                  <span className="text-yellow-300 mr-2">🎁</span>
                  <p>Save over $5,000+ vs annual plans.</p>
                </div>
                
                <div className="flex items-start">
                  <span className="text-yellow-300 mr-2">🔐</span>
                  <p>Perfect for startups, agencies & early-stage compliance teams.</p>
                </div>

                <div className="bg-yellow-400/20 rounded-lg px-4 py-2 flex items-center">
                  <div className="font-bold">
                    <span className="block">Limited offer!</span>
                    <span className="text-lg">Only 12 spots left</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Button 
                size="lg"
                onClick={() => navigate('/payment', { state: { selectedPlan: 'lifetime' } })}
                className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-8 py-6 text-lg shadow-lg"
              >
                Get Lifetime Access - $999
              </Button>
              <p className="text-center text-sm mt-2 text-white/80">One-time payment. Forever access.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifetimeOfferBanner;
