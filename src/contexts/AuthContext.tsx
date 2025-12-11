import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isMELUser: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; isAdmin?: boolean; isMELUser?: boolean }>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  createMELUser: (userData: { email: string; password: string; fullName: string; username: string }) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMELUser, setIsMELUser] = useState(false);

  const checkUserRoles = async (userId: string) => {
    try {
      console.log('Checking roles for user:', userId);
      
      // Check if user is admin
      const adminQuery = (supabase.from('admins') as any);
      const { data: adminData, error: adminError } = await adminQuery
        .select('user_id')
        .eq('user_id', userId)
        .single();

      console.log('Admin query result:', adminData, adminError);
      
      // Check if user is MEL user
      const melQuery = (supabase.from('mel_users') as any);
      const { data: melData, error: melError } = await melQuery
        .select('user_id')
        .eq('user_id', userId)
        .single();

      console.log('MEL query result:', melData, melError);

      const isAdminUser = !!adminData && !adminError;
      const isMELUserUser = !!melData && !melError;
      
      setIsAdmin(isAdminUser);
      setIsMELUser(isMELUserUser);
      
      console.log('Final roles:', { isAdmin: isAdminUser, isMELUser: isMELUserUser });
      
      return { isAdmin: isAdminUser, isMELUser: isMELUserUser };
    } catch (error) {
      console.error('Error checking user roles:', error);
      setIsAdmin(false);
      setIsMELUser(false);
      return { isAdmin: false, isMELUser: false };
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST - use synchronous callback to prevent deadlocks
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // CRITICAL: Defer role checking with setTimeout to prevent deadlock
          setTimeout(() => {
            checkUserRoles(session.user.id).finally(() => {
              setLoading(false);
            });
          }, 0);
        } else {
          // Clear roles when no user
          setIsAdmin(false);
          setIsMELUser(false);
          setLoading(false);
        }
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserRoles(session.user.id).finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Error getting initial session:', error);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error && data.user) {
      // Roles will be checked by the auth state change listener
      const roles = await checkUserRoles(data.user.id);
      setLoading(false);
      return { error, ...roles };
    }
    
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      // Clear all state
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsMELUser(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { error };
  };

  const createMELUser = async (userData: { email: string; password: string; fullName: string; username: string }) => {
    if (!isAdmin) {
      return { error: { message: 'Unauthorized: Only admins can create MEL users' } };
    }

    try {
      // Call the edge function to create user with admin privileges
      const { data, error } = await supabase.functions.invoke('create-mel-user', {
        body: {
          email: userData.email,
          password: userData.password,
          fullName: userData.fullName,
          username: userData.username
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Error creating MEL user:', error);
      return { error: { message: 'Failed to create MEL user' } };
    }
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    isMELUser,
    signIn,
    signOut,
    updatePassword,
    createMELUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
