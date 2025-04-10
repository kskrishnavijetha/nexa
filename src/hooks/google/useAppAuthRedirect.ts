
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function useAppAuthRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      console.log('User not authenticated, redirecting to sign-in page');
      toast.error('Please sign in to access Cloud Services Scanner');
      navigate('/sign-in', { replace: true });
    } else {
      console.log('User authenticated, can access Cloud Services Scanner');
    }
  }, [user, navigate]);
  
  return { isAuthenticated: !!user };
}
