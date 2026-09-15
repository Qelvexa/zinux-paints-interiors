import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  getToken: () => string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signIn: async () => ({ success: false }),
  signOut: async () => {},
  getToken: () => null,
});

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const verifyServerAuth = async (token: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        return !!data.authorized;
      }
      return false;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);

      if (currentSession?.access_token) {
        const authorized = await verifyServerAuth(currentSession.access_token);
        if (mounted) setIsAdmin(authorized);
      } else {
        if (mounted) setIsAdmin(false);
      }
      if (mounted) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);

      if (currentSession?.access_token) {
        const authorized = await verifyServerAuth(currentSession.access_token);
        if (mounted) setIsAdmin(authorized);
      } else {
        if (mounted) setIsAdmin(false);
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password?: string) => {
    if (!email || !password) {
      return { success: false, error: 'Please enter your email and password.' };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        return { success: false, error: error.message || 'Invalid email or password.' };
      }

      if (!data.session?.access_token) {
        await supabase.auth.signOut();
        return { success: false, error: 'Failed to establish session.' };
      }

      // Verify administrator privileges server-side
      const authorized = await verifyServerAuth(data.session.access_token);

      if (!authorized) {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        return { success: false, error: 'Access denied: This account is not authorized for administrator access.' };
      }

      setUser(data.user);
      setSession(data.session);
      setIsAdmin(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed.' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const getToken = () => {
    return session?.access_token || null;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        signIn,
        signOut,
        getToken,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
