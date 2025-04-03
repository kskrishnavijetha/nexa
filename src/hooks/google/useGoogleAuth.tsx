
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useGoogleAuth() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get('code');
    const error = params.get('error');
    
    if (authCode) {
      // Successfully authorized
      toast.success('Google authorization successful!');
      // Clear URL parameters without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      // Authorization failed
      toast.error('Google authorization failed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
}
