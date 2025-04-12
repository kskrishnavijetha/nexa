
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Features from '@/components/Features';
import Hero from '@/components/home/Hero';
import WhyChooseSection from '@/components/home/WhyChooseSection';
import FaqSection from '@/components/home/FaqSection';
import ComplianceFeaturesSection from '@/components/home/ComplianceFeaturesSection';
import IndustriesSection from '@/components/home/IndustriesSection';
import ResultsSection from '@/components/home/ResultsSection';
import UserGuide from '@/components/home/UserGuide';
import TrustedBySection from '@/components/home/TrustedBySection';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { shouldUpgrade, getSubscription } from '@/utils/paymentService';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const needsUpgrade = user ? shouldUpgrade() : false;
  const subscription = user ? getSubscription() : null;
  
  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {needsUpgrade && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold text-amber-800">
                    {subscription?.plan === 'free' 
                      ? 'Your free plan is complete' 
                      : `Your ${subscription?.plan} plan limit reached`}
                  </h3>
                  <p className="text-amber-700">
                    {subscription?.scansUsed >= (subscription?.scansLimit || 0)
                      ? `You've used all ${subscription?.scansLimit} scans in your ${subscription?.plan} plan.`
                      : 'Your subscription has expired.'}
                    {' '}Please upgrade to continue using all features.
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
          )}
          
          <Hero />
          <TrustedBySection />
          <WhyChooseSection />
          <FaqSection />
          <ComplianceFeaturesSection />
          <IndustriesSection />
          <ResultsSection />
          <UserGuide />
          <Features />
        </div>
      </div>
    </Layout>
  );
};

export default Index;

