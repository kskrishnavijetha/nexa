
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Auth provider initializing...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          // Clear all state first
          setSession(null);
          setUser(null);
          
          // Clear any user-specific data from localStorage on sign out
          clearUserData();
          
          toast.info('Signed out');
        } else {
          // For all other events, update session and user state
          setSession(session);
          setUser(session?.user ?? null);
          
          if (event === 'SIGNED_IN') {
            toast.success('Signed in successfully!');
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'User is logged in' : 'No session found');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to clear user data from localStorage
  const clearUserData = () => {
    console.log('Clearing user data from localStorage');
    const keys = Object.keys(localStorage);
    const userDataKeys = keys.filter(key => key.startsWith('compliZen_'));
    userDataKeys.forEach(key => {
      localStorage.removeItem(key);
    });
  };

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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    console.log('Signing out...');
    
    try {
      // First clear user data manually to ensure clean state
      clearUserData();
      
      // Reset our own state immediately to prevent data leakage
      setSession(null);
      setUser(null);
      
      // Then perform the actual signOut operation
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Failed to sign out. Please try again.');
        throw error;
      }
      
      console.log('Signout completed successfully');
    } catch (error) {
      console.error('Exception during sign out:', error);
      toast.error('Failed to sign out. Please try again.');
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
