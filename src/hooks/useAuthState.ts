
import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { clearUserData } from '@/utils/auth/authUtils';

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth provider initializing...');
    
    // If we've been loading for more than 5 seconds, reset the loading state
    if (loading) {
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.log('Auth loading timeout reached, resetting loading state');
          setLoading(false);
        }
      }, 5000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [loading]);

  // Separate useEffect for auth state to avoid dependency issues
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN') {
          // Update session and user immediately
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);
          
          toast.success('Signed in successfully!');
          
        } else if (event === 'SIGNED_OUT') {
          // Clear all state
          setSession(null);
          setUser(null);
          setLoading(false);
          
          // Clear any user-specific data from localStorage on sign out
          clearUserData();
          
          console.log('User signed out, state cleared');
          toast.success('Signed out successfully');
        } else if (event === 'TOKEN_REFRESHED') {
          // Update session with refreshed token
          setSession(newSession);
          setLoading(false);
        } else {
          // For all other events, update session and user state
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('Initial session check:', initialSession ? 'User is logged in' : 'No session found');
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error) {
      toast.success('Verification email sent! Please check your inbox.');
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Make sure to stop loading on error
        setLoading(false);
      }

      return { error };
    } catch (err) {
      setLoading(false);
      console.error('Error during sign in:', err);
      return { error: err };
    }
  };

  const signOut = useCallback(async () => {
    console.log('Signing out...');
    setLoading(true);
    
    try {
      // First manually clear all user data to ensure clean state
      clearUserData();
      
      // Execute the signOut call to Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Only sign out from this device
      });
      
      if (error) {
        console.error('Error from Supabase during sign out:', error);
        toast.error('Failed to sign out. Please try again.');
        setLoading(false);
        return { error };
      }
      
      // Force update local state regardless of response
      setSession(null);
      setUser(null);
      
      console.log('Signout completed successfully');
      toast.success('Signed out successfully');
      setLoading(false);
      
      // Navigate to home page
      navigate('/', { replace: true });
      
      return { error: null };
      
    } catch (error) {
      console.error('Exception during sign out:', error);
      toast.error('Failed to sign out. Please try again.');
      setLoading(false);
      
      // Still clear local state even if there's an error
      setSession(null);
      setUser(null);
      clearUserData();
      
      return { error };
    }
  }, [navigate]);

  return {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut
  };
}
