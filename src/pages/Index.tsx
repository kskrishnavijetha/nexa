
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Features from '@/components/Features';
import Hero from '@/components/home/Hero';
import WhyChooseSection from '@/components/home/WhyChooseSection';
import ComplianceFeaturesSection from '@/components/home/ComplianceFeaturesSection';
import IndustriesSection from '@/components/home/IndustriesSection';
import ResultsSection from '@/components/home/ResultsSection';
import UserGuide from '@/components/home/UserGuide';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { shouldUpgrade, hasActiveSubscription, getSubscription, hasScanLimitReached, getScansRemaining } from '@/utils/payment/subscriptionService';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const needsUpgrade = user ? shouldUpgrade() : false;
  const hasSubscription = user ? hasActiveSubscription() : false;
  const subscription = user ? getSubscription() : null;
  const expiredPlan = needsUpgrade && subscription ? subscription.plan : null;
  const scanLimitReached = user && subscription ? hasScanLimitReached() : false;
  const scansRemaining = user && subscription ? getScansRemaining() : 0;
  
  // Redirect logged-in users with active subscription to dashboard
  useEffect(() => {
    if (user && hasSubscription && !needsUpgrade) {
      navigate('/dashboard');
    }
  }, [user, hasSubscription, needsUpgrade, navigate]);
  
  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {user && !hasSubscription && (
            <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold text-primary">Get started with a subscription</h3>
                  <p className="text-muted-foreground">Select a plan to access all features of our platform.</p>
                </div>
                <Button 
                  onClick={() => navigate('/pricing')}
                  className="bg-primary hover:bg-primary/90"
                >
                  View Pricing Plans
                </Button>
              </div>
            </div>
          )}
          
          {needsUpgrade && expiredPlan && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  {scanLimitReached ? (
                    <>
                      <h3 className="text-lg font-semibold text-amber-800">Scan limit reached for your {expiredPlan} plan</h3>
                      <p className="text-amber-700">You've used all {subscription?.scansLimit} scans in your plan. Please upgrade to continue.</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-amber-800">Your {expiredPlan} plan has expired</h3>
                      <p className="text-amber-700">Please renew or upgrade your subscription to continue using all features.</p>
                    </>
                  )}
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
          
          {user && hasSubscription && !needsUpgrade && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold text-green-800">Your {subscription?.plan} plan is active</h3>
                  <p className="text-green-700">
                    You have {scansRemaining} scan{scansRemaining !== 1 ? 's' : ''} remaining. 
                    Expires on {subscription?.expirationDate.toLocaleDateString()}.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
          
          <Hero />
          <WhyChooseSection />
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
