import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Package, AlarmClock, Clock, Shield, ChevronRight, Timer } from 'lucide-react';

const OFFER_DURATION = 48 * 60 * 60 * 1000; // 48 hours

const LifetimeOfferBanner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [offerActive, setOfferActive] = useState(true);

  function getOfferStartTime() {
    const key = 'nexabloom_lifetime_offer_start';
    let offerStart = localStorage.getItem(key);
    if (!offerStart) {
      const now = Date.now();
      localStorage.setItem(key, now.toString());
      offerStart = now.toString();
    }
    return Number(offerStart);
  }

  function formatTime(ms: number) {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    const offerStart = getOfferStartTime();
    function updateTimer() {
      const now = Date.now();
      const timeRemaining = offerStart + OFFER_DURATION - now;
      if (timeRemaining <= 0) {
        setOfferActive(false);
        setTimeLeft(0);
      } else {
        setTimeLeft(timeRemaining);
        setOfferActive(true);
      }
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleGetLifetimeDeal = () => {
    if (user) {
      window.open('https://www.paypal.com/ncp/payment/YF2GNLBJ2YCEE', '_blank');
    } else {
      navigate('/sign-in', { state: { redirectAfterLogin: 'lifetime-payment' } });
    }
  };

  if (!offerActive) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-[#1A1F2C] to-[#2A304A] py-8 animate-fade-in">
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
                    {typeof timeLeft === "number" && (
                      <span className="flex items-center ml-3 text-xs text-[#D6BCFA] font-semibold bg-[#6E59A5]/80 backdrop-blur-md rounded px-3 py-0.5 shadow-lg ring-1 ring-[#9b87f5]">
                        <Timer className="h-3 w-3 mr-1 text-[#D6BCFA]" />
                        {formatTime(timeLeft)}
                      </span>
                    )}
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
                disabled={timeLeft !== null && timeLeft <= 0}
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
