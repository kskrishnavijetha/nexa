import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { clearUserData } from '@/utils/auth/authUtils';
import { ensureFreePlan } from '@/utils/payment/subscriptionService';

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout: if loading hangs, unblock UI after 5s
    const timeoutId = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // Listen for auth state changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN') {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);

          // Ensure the user has a free plan in the DB
          if (newSession?.user) {
            await ensureFreePlan(newSession.user.id);
            toast.success('Welcome! Your free plan is active with 5 scans per month.');
          }

        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setLoading(false);
          clearUserData();
          console.log('User signed out, state cleared');

        } else if (event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          setLoading(false);

        } else {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);
        }
      }
    );

    // THEN check for an existing session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      console.log('Initial session check:', initialSession ? 'logged in' : 'no session');
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        await ensureFreePlan(initialSession.user.id);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: name || '', name: name || '' },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setLoading(false);
      return { error };
    } catch (err) {
      setLoading(false);
      return { error: err };
    }
  };

  const signOut = useCallback(async () => {
    console.log('Signing out...');
    setLoading(true);
    try {
      clearUserData();
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        toast.error('Failed to sign out. Please try again.');
        setLoading(false);
        return { error };
      }
      setSession(null);
      setUser(null);
      setLoading(false);
      return { error: null };
    } catch (error) {
      toast.error('Failed to sign out. Please try again.');
      setSession(null);
      setUser(null);
      clearUserData();
      setLoading(false);
      return { error };
    }
  }, []);

  return { session, user, loading, signUp, signIn, signOut };
}
