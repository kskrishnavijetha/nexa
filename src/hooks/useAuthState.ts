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
    console.log('useAuthState - Auth provider initializing...');
    
    // If we've been loading for more than 5 seconds, reset the loading state
    if (loading) {
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.log('useAuthState - Auth loading timeout reached, resetting loading state');
          setLoading(false);
        }
      }, 5000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [loading]);

  // Separate useEffect for auth state to avoid dependency issues
  useEffect(() => {
    console.log('useAuthState - Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('useAuthState - Auth state changed:', event, { hasSession: !!newSession, userId: newSession?.user?.id });
        
        if (event === 'SIGNED_IN') {
          // Only process sign in if the user has been email confirmed
          if (newSession?.user?.email_confirmed_at) {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setLoading(false);
            
            console.log('useAuthState - User signed in successfully with confirmed email');
            toast.success('Signed in successfully!');
          } else {
            // User signed up but hasn't confirmed email - don't set them as signed in
            console.log('useAuthState - User registered but email not confirmed, staying signed out');
            setSession(null);
            setUser(null);
            setLoading(false);
          }
          
        } else if (event === 'SIGNED_OUT') {
          // Clear all state
          setSession(null);
          setUser(null);
          setLoading(false);
          
          // Clear any user-specific data from localStorage on sign out
          clearUserData();
          
          console.log('useAuthState - User signed out, state cleared');
          toast.success('Signed out successfully');
        } else if (event === 'TOKEN_REFRESHED') {
          // Update session with refreshed token
          setSession(newSession);
          setLoading(false);
          console.log('useAuthState - Token refreshed');
        } else {
          // For all other events, update session and user state
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);
          console.log('useAuthState - Auth state updated for event:', event);
        }
      }
    );

    // THEN check for existing session
    console.log('useAuthState - Checking for existing session...');
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      console.log('useAuthState - Initial session check:', { 
        hasSession: !!initialSession, 
        userId: initialSession?.user?.id, 
        emailConfirmed: !!initialSession?.user?.email_confirmed_at,
        error 
      });
      
      if (error) {
        console.error('useAuthState - Error getting initial session:', error);
      }
      
      // Only set session if email is confirmed
      if (initialSession?.user?.email_confirmed_at) {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('useAuthState - Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email: string, password: string) => {
    console.log('useAuthState - Starting sign up for:', email);
    
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/sign-in`
        }
      });

      console.log('useAuthState - Sign up result:', { error, hasUser: !!data?.user });

      return { error };
    } catch (err) {
      console.error('useAuthState - Exception during sign up:', err);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('useAuthState - Starting sign in for:', email);
    setLoading(true);
    
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('useAuthState - Sign in result:', { 
        error, 
        hasUser: !!data?.user, 
        hasSession: !!data?.session 
      });

      if (error) {
        console.error('useAuthState - Sign in error:', error);
        // Make sure to stop loading on error
        setLoading(false);
      } else {
        console.log('useAuthState - Sign in successful, user:', data?.user?.email);
      }

      return { error };
    } catch (err) {
      setLoading(false);
      console.error('useAuthState - Exception during sign in:', err);
      return { error: err };
    }
  };

  const signOut = useCallback(async () => {
    console.log('useAuthState - Signing out...');
    setLoading(true);
    
    try {
      // First manually clear all user data to ensure clean state
      clearUserData();
      
      // Execute the signOut call to Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Only sign out from this device
      });
      
      if (error) {
        console.error('useAuthState - Error from Supabase during sign out:', error);
        toast.error('Failed to sign out. Please try again.');
        setLoading(false);
        return { error };
      }
      
      // Force update local state regardless of response
      setSession(null);
      setUser(null);
      
      console.log('useAuthState - Signout completed successfully');
      toast.success('Signed out successfully');
      setLoading(false);
      
      // Navigate to home page
      navigate('/', { replace: true });
      
      return { error: null };
      
    } catch (error) {
      console.error('useAuthState - Exception during sign out:', error);
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
