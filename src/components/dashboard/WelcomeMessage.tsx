
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSubscription } from '@/utils/paymentService';
import { useAuth } from '@/contexts/AuthContext';

const WelcomeMessage: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const { user } = useAuth();
  
  const subscription = user ? getSubscription(user.id) : null;
  const isPro = subscription && subscription.plan !== 'free';
  const isLifetime = subscription?.isLifetime || false;

  useEffect(() => {
    // Check if this is the user's first visit
    const hasVisitedBefore = localStorage.getItem('nexabloom_visited');
    if (!hasVisitedBefore && user) {
      setIsFirstVisit(true);
      localStorage.setItem('nexabloom_visited', 'true');
    }
  }, [user]);

  if (dismissed || !isFirstVisit) {
    return null;
  }

  return (
    <Card className="mb-6 relative overflow-hidden border-l-4 border-l-primary">
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-2 right-2 h-8 w-8 p-0" 
        onClick={() => setDismissed(true)}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">
          {isPro ? `Thanks for joining NexaBloom ${isLifetime ? 'Lifetime' : 'Pro'}!` : 'Welcome to NexaBloom!'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isPro ? (
          <div className="space-y-2">
            <p>You now have access to:</p>
            <ul className="list-none space-y-1">
              <li className="flex items-center">✅ <span className="ml-2">Extended audit-ready reports</span></li>
              <li className="flex items-center">✅ <span className="ml-2">Risk simulations</span></li>
              <li className="flex items-center">✅ <span className="ml-2">Smart alerts & audit trails</span></li>
              {isLifetime && (
                <li className="flex items-center">✅ <span className="ml-2">Lifetime access</span></li>
              )}
            </ul>
            <p className="font-medium mt-3">You're audit-ready — let's get to work.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-medium">NexaBloom is your AI compliance copilot!</p>
            <p>Ready to help you analyze, simulate, and generate audit-ready compliance reports — all backed by AI and hash-verified for trust.</p>
            <p className="mt-2">Need help? Our support team is just a click away.</p>
            <div className="mt-3">
              <Button asChild className="mr-2">
                <a href="/document-analysis">Start Your First Scan</a>
              </Button>
              {!isPro && (
                <Button variant="outline" asChild>
                  <a href="/pricing">Explore Pro Features</a>
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WelcomeMessage;
