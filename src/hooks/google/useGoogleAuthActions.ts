
import { toast } from 'sonner';
import {
  isUserSignedInToGoogle,
  signInToGoogle as googleSignIn,
  signOutFromGoogle as googleSignOut
} from './googleApiLoader';

interface UseGoogleAuthActionsProps {
  gApiInitialized: boolean;
  isDemoMode: boolean;
  setIsGoogleAuthenticated: (authenticated: boolean) => void;
}

export function useGoogleAuthActions({
  gApiInitialized,
  isDemoMode,
  setIsGoogleAuthenticated
}: UseGoogleAuthActionsProps) {
  // Sign in to Google
  const signInToGoogle = async () => {
    if (!gApiInitialized && !isDemoMode) {
      toast.error('Google API not initialized yet. Please try again after the API initializes.');
      return false;
    }
    
    if (isDemoMode) {
      console.log('Demo mode: Simulating Google sign-in');
      setIsGoogleAuthenticated(true);
      toast.success('Connected to Google in demo mode');
      return true;
    }
    
    const success = await googleSignIn();
    if (success) {
      setIsGoogleAuthenticated(true);
    }
    return success;
  };

  // Sign out from Google
  const signOutFromGoogle = async () => {
    if (isDemoMode) {
      console.log('Demo mode: Simulating Google sign-out');
      setIsGoogleAuthenticated(false);
      return true;
    }
    
    const success = await googleSignOut();
    if (success) {
      setIsGoogleAuthenticated(false);
    }
    return success;
  };

  // Check if user is authenticated with Google
  const checkGoogleAuthStatus = () => {
    if (isDemoMode) return false;
    
    if (gApiInitialized) {
      const isSignedIn = isUserSignedInToGoogle();
      setIsGoogleAuthenticated(isSignedIn);
      return isSignedIn;
    }
    
    return false;
  };

  return {
    signInToGoogle,
    signOutFromGoogle,
    checkGoogleAuthStatus
  };
}
