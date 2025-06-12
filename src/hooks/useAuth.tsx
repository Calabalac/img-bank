
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Сначала очищаем возможные некорректные токены
        const hash = window.location.hash;
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for recovery tokens in URL
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        // Check for direct recovery parameters
        const recoveryToken = urlParams.get('token');
        const recoveryType = urlParams.get('type');
        
        console.log('Auth initialization - Hash tokens:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        console.log('Auth initialization - URL params:', { recoveryToken: !!recoveryToken, recoveryType });

        // Handle recovery tokens
        if (accessToken && refreshToken && type === 'recovery') {
          console.log('Processing recovery tokens from hash');
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (!error && data.session && mounted) {
            setSession(data.session);
            setUser(data.session.user);
            
            // Clear URL and redirect to reset password
            window.history.replaceState({}, document.title, '/reset-password');
            window.location.href = '/reset-password';
            return;
          }
        }
        
        // Handle direct recovery links
        if (recoveryToken && recoveryType === 'recovery') {
          console.log('Processing direct recovery link');
          window.location.href = `/reset-password?token=${recoveryToken}&type=${recoveryType}`;
          return;
        }

        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          // Clear potentially corrupted session
          await supabase.auth.signOut();
        }
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          console.log('Initial session loaded:', currentSession?.user?.email || 'No user');
        }

        // Clean up URL if it has auth parameters
        if (hash.includes('access_token') || hash.includes('type=')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email || 'No user');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Handle sign out
          if (event === 'SIGNED_OUT') {
            setLoading(false);
          }
          
          // Handle successful sign in
          if (event === 'SIGNED_IN' && session) {
            setLoading(false);
          }
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful:', data.user?.email);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            username: username.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });
      
      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }
      
      console.log('Sign up successful:', data.user?.email);
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
      
      if (error) {
        console.error('Reset password error:', error);
        throw error;
      }
      
      console.log('Reset password email sent');
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      console.log('Sign out successful');
      
      // Force clear state
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      // Force clear state even on error
      setSession(null);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
