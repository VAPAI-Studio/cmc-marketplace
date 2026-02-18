import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { supabase, type User } from '../lib/supabase';
import { useToastHelpers } from '../components/ui';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, role: 'creator' | 'buyer', displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Direct PostgREST fetch — bypasses Supabase JS client's navigatorLock issues
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function fetchProfileDirect(userId: string, accessToken?: string): Promise<User | null> {
  const headers: Record<string, string> = {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.pgrst.object+json', // .single() equivalent
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=*`,
    { headers }
  );

  if (!res.ok) {
    console.error('[fetchProfileDirect] HTTP error:', res.status, await res.text());
    return null;
  }

  const data = await res.json();
  return data as User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isSigningUpRef = useRef(false);
  const toast = useToastHelpers();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[onAuthStateChange]', event, 'isSigningUp:', isSigningUpRef.current);

        if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && session && !isSigningUpRef.current) {
          console.log('[onAuthStateChange] Fetching profile for event:', event);
          try {
            const profile = await fetchProfileDirect(session.user.id, session.access_token);
            if (profile) {
              console.log('[onAuthStateChange] Profile loaded:', profile.email);
              setUser(profile);
            } else {
              console.warn('[onAuthStateChange] No profile found for user');
              setUser(null);
            }
          } catch (error) {
            console.error('[onAuthStateChange] Error:', error);
            setUser(null);
          }
          setLoading(false);
        } else if (event === 'INITIAL_SESSION' && !session) {
          console.log('[onAuthStateChange] No initial session');
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signUp(
    email: string,
    password: string,
    role: 'creator' | 'buyer',
    displayName: string
  ) {
    console.log('[signUp] Starting signup for:', email);
    try {
      setLoading(true);
      isSigningUpRef.current = true;

      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');
      console.log('[signUp] Auth user created:', authData.user.id);

      // 2. Create user profile via direct fetch
      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${authData.session?.access_token || SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          id: authData.user.id,
          email,
          role,
          display_name: displayName,
        }),
      });

      if (!insertRes.ok) {
        const errText = await insertRes.text();
        console.error('[signUp] Profile insert failed:', errText);
        throw new Error('Failed to create user profile');
      }

      const profileArr = await insertRes.json();
      const profile = Array.isArray(profileArr) ? profileArr[0] : profileArr;
      console.log('[signUp] Profile created:', profile);
      setUser(profile as User);

      toast.success('Account created successfully! Welcome to CMC.');
    } catch (error: any) {
      console.error('[signUp] Error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
      isSigningUpRef.current = false;
    }
  }

  async function signIn(email: string, password: string) {
    console.log('[signIn] Starting login for:', email);
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned from login');

      // Profile will be loaded by onAuthStateChange SIGNED_IN event
      console.log('[signIn] Auth success — profile will load via onAuthStateChange');
      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('[signIn] Error:', error);
      toast.error(error.message || 'Invalid email or password');
      setLoading(false);
      throw error;
    }
  }

  async function signOut() {
    console.log('[signOut] Starting logout...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      localStorage.removeItem('sb-lrojxsaxgddodrswzuhb-auth-token');

      console.log('[signOut] Logout successful');
      toast.info('Signed out successfully');
    } catch (error: any) {
      console.error('[signOut] Logout error:', error);
      setUser(null);
      localStorage.removeItem('sb-lrojxsaxgddodrswzuhb-auth-token');
      toast.error(error.message || 'Failed to sign out');
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
