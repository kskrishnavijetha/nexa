
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Features from '@/components/Features';
import Hero from '@/components/home/Hero';
import WhyChooseSection from '@/components/home/WhyChooseSection';
import ComplianceFeaturesSection from '@/components/home/ComplianceFeaturesSection';
import IndustriesSection from '@/components/home/IndustriesSection';
import ResultsSection from '@/components/home/ResultsSection';
import FaqSection from '@/components/home/FaqSection';
import TrustedBySection from '@/components/home/TrustedBySection';
import UserGuide from '@/components/home/UserGuide';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { shouldUpgrade, getSubscription, SubscriptionInfo } from '@/utils/paymentService';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LifetimeOfferBanner from '@/components/home/LifetimeOfferBanner';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadSubscriptionInfo() {
      if (user) {
        try {
          const [upgradeNeeded, userSubscription] = await Promise.all([
            shouldUpgrade(),
            getSubscription()
          ]);
          
          setNeedsUpgrade(upgradeNeeded);
          setSubscription(userSubscription);
        } catch (error) {
          console.error("Error loading subscription info:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    
    loadSubscriptionInfo();
  }, [user]);
  
  return (
    <Layout>
      <div className="min-h-screen">
        {user && subscription && (
          <div className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-3 md:mb-0">
                  <h3 className="text-lg font-semibold">
                    Your {subscription.plan} plan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {subscription.scansLimit === 999 ? 
                      'Unlimited scans available' : 
                      `${subscription.scansLimit - subscription.scansUsed} of ${subscription.scansLimit} scans remaining this month`
                    }
                  </p>
                </div>
                {needsUpgrade && (
                  <Button 
                    onClick={() => navigate('/pricing')}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    {subscription?.plan === 'free' ? 'Upgrade Plan' : 'Renew Subscription'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {needsUpgrade && subscription && (
          <div className="bg-amber-50 border-b border-amber-200">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-3 md:mb-0">
                  <h3 className="text-lg font-semibold text-amber-800">
                    {subscription.plan === 'free' 
                      ? 'Your free plan is complete' 
                      : `Your ${subscription.plan} plan limit reached`}
                  </h3>
                  <p className="text-amber-700">
                    {subscription.scansUsed >= (subscription.scansLimit || 0)
                      ? `You've used all ${subscription.scansLimit} scans in your ${subscription.plan} plan.`
                      : 'Your subscription has expired.'}
                    {' '}Please upgrade to continue using Nexabloom.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/pricing')}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  View Pricing Plans
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <Hero />
        <LifetimeOfferBanner />
        <TrustedBySection />
        <ComplianceFeaturesSection />
        <Separator className="max-w-5xl mx-auto" />
        <WhyChooseSection />
        <ResultsSection />
        <IndustriesSection />
        <FaqSection />
        <UserGuide />
      </div>
    </Layout>
  );
};

export default Index;
