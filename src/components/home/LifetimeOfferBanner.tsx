
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Package, AlarmClock, Clock, Shield, ChevronRight } from 'lucide-react';

const LifetimeOfferBanner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetLifetimeDeal = () => {
    if (user) {
      // If user is logged in, redirect directly to PayPal payment link
      window.open('https://www.paypal.com/ncp/payment/YF2GNLBJ2YCEE', '_blank');
    } else {
      // If user is not logged in, redirect to sign in page first
      navigate('/sign-in', { state: { redirectAfterLogin: 'lifetime-payment' } });
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#1A1F2C] to-[#2A304A] py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex">
                <Package className="h-10 w-10 text-[#9b87f5]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-300 font-medium text-sm rounded-full bg-amber-300/10 px-3 py-1 flex items-center gap-1">
                    <AlarmClock className="h-3.5 w-3.5" />
                    <span>OFFER CLOSES SOON</span>
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Get <span className="text-[#9b87f5]">Lifetime Access</span> to NexaBloom
                </h3>
                <p className="text-gray-300 mb-3">
                  For just <span className="font-bold text-white">$999</span> – one-time. No monthly fees.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <Clock className="h-4 w-4 text-amber-300" />
                    <span>Only 100 licenses available</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <Shield className="h-4 w-4 text-amber-300" />
                    <span>Stay compliant for life</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Button 
                onClick={handleGetLifetimeDeal}
                size="lg"
                className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-5 py-6 h-auto text-base font-medium"
              >
                Get Lifetime Deal
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Once they're gone, this offer is closed forever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifetimeOfferBanner;
