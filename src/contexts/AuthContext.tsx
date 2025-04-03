
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to clear user data from localStorage - moved outside component
const clearUserData = () => {
  console.log('Clearing user data from localStorage');
  const keys = Object.keys(localStorage);
  const userDataKeys = keys.filter(key => key.startsWith('compliZen_'));
  userDataKeys.forEach(key => {
    localStorage.removeItem(key);
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializeCount, setInitializeCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth provider initializing...');
    
    // If we've been loading for more than 10 seconds, reset the loading state
    if (loading) {
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.log('Auth loading timeout reached, resetting loading state');
          setLoading(false);
        }
      }, 10000);
      
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
          // Update session and user
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);
          
          // Clear any previous user data first
          clearUserData();
          
          toast.success('Signed in successfully!');
          
        } else if (event === 'SIGNED_OUT') {
          // Clear all state
          setSession(null);
          setUser(null);
          setLoading(false);
          
          // Clear any user-specific data from localStorage on sign out
          clearUserData();
          
          // Force navigation to home page
          navigate('/', { replace: true });
          toast.info('Signed out');
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
      
      setInitializeCount(prev => prev + 1);
      console.log('Auth initialization complete, count:', initializeCount + 1);
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
      // Prevent state flashing during sign in
      // Don't clear existing data until we have a successful sign in
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        // Only clear user data on successful sign in
        clearUserData();
      } else {
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

  const signOut = async () => {
    console.log('Signing out...');
    
    try {
      // First clear user data manually to ensure clean state
      clearUserData();
      
      // Handle sign out - the important fix is here
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Failed to sign out. Please try again.');
        throw error;
      }
      
      // The onAuthStateChange listener will handle state updates
      // But we'll set these explicitly to ensure immediate UI updates
      setSession(null);
      setUser(null);
      
      console.log('Signout completed successfully');
      
      // Navigate after successful sign out
      // This is now handled by the onAuthStateChange listener
    } catch (error) {
      console.error('Exception during sign out:', error);
      toast.error('Failed to sign out. Please try again.');
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
