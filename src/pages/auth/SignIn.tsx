
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { hasActiveSubscription } from '@/utils/paymentService';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, loading } = useAuth();

  // Reset loading state if stuck for more than 10 seconds
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        console.log('Sign-in loading timeout reached, resetting loading state');
        toast.error('Login is taking longer than expected. Please try again.');
      }, 10000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading]);

  // Redirect if already logged in, but only if we're not already redirecting
  useEffect(() => {
    if (user && !isRedirecting && !loading) {
      console.log('User already logged in, checking subscription status');
      setIsRedirecting(true);
      
      // Check if user has an active subscription
      const hasSubscription = hasActiveSubscription();
      
      let redirectPath = '/dashboard';
      
      // If no active subscription, redirect to payment page
      if (!hasSubscription) {
        redirectPath = '/payment';
        console.log('No active subscription found, redirecting to payment page');
      } else {
        // Check if there's a saved redirect path from a protected route
        const savedRedirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (savedRedirectPath) {
          redirectPath = savedRedirectPath;
          // Clear the saved path
          sessionStorage.removeItem('redirectAfterLogin');
          console.log('Redirecting to saved path:', redirectPath);
        }
      }
      
      // Use a timeout to prevent UI flickering
      const redirectTimer = setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 300);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, navigate, isRedirecting, loading]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    setLoginAttempt(prev => prev + 1);
    
    try {
      console.log(`Login attempt ${loginAttempt + 1} for ${email}`);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Sign in error:', error.message);
        toast.error(error.message);
        setIsLoading(false);
      } else {
        // Don't set loading to false here - we're going to redirect which will unmount this component
        console.log('Sign in successful, waiting for auth state to update');
        setIsRedirecting(true);
      }
    } catch (error: any) {
      console.error('Unexpected sign in error:', error);
      toast.error(error.message || 'An error occurred during sign in');
      setIsLoading(false);
    }
  };

  // If we're in the auth loading state or redirecting, show a simple loading UI
  if ((loading && user) || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Preparing your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In to Nexabloom</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>
        
        <form onSubmit={handleSignIn} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                autoComplete="email"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                autoComplete="current-password"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
