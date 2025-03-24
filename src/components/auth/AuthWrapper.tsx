
import React, { useEffect } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSubscription, hasActiveSubscription } from '@/utils/paymentService';
import { toast } from 'sonner';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const subscription = getSubscription();
  const { isSignedIn, isLoaded } = useAuth();
  
  useEffect(() => {
    if (!isLoaded) return;
    
    if (isSignedIn) {
      // Check if user has subscription
      if (!subscription) {
        toast.info("Please select a subscription plan to continue");
        navigate("/payment");
        return;
      }
      
      // Check if subscription is active
      if (!hasActiveSubscription()) {
        toast.error("Your subscription has expired. Please renew to continue.");
        navigate("/payment");
        return;
      }
    }
  }, [isSignedIn, isLoaded, navigate, subscription]);

  return (
    <>
      <SignedIn>
        {subscription && hasActiveSubscription() ? children : null}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default AuthWrapper;
