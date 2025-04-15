
import React, { createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/useAuthState';
import { clearUserSubscription } from '@/utils/paymentService';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any | null }>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authState = useAuthState();

  // Override the signOut method to clear user subscription data when signing out
  const enhancedAuthState = {
    ...authState,
    signOut: async () => {
      // Clear user subscription data before signing out
      if (authState.user?.id) {
        // Note: We're not clearing the subscription on logout anymore
        // This ensures the subscription persists across sessions
        // clearUserSubscription(authState.user.id);
      }
      
      // Then proceed with normal sign out
      return authState.signOut();
    }
  };

  return <AuthContext.Provider value={enhancedAuthState}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get the current user ID safely
export const useUserId = () => {
  const { user } = useAuth();
  return user?.id;
};
