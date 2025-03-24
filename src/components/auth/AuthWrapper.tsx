
import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';
import { getSubscription, hasActiveSubscription } from '@/utils/paymentService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const subscription = getSubscription();
  
  React.useEffect(() => {
    // Check if user has subscription
    if (!subscription) {
      toast.error("Please select a subscription plan to continue");
      navigate("/payment");
      return;
    }
    
    // Check if subscription is active
    if (!hasActiveSubscription()) {
      toast.error("Your subscription has expired. Please renew to continue.");
      navigate("/payment");
      return;
    }
  }, [navigate, subscription]);

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
