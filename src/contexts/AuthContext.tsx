'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { MOCK_PARENT, MOCK_CHILDREN } from '@/lib/mock-data';

interface Profile {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginChild: (secretCode: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    // In dev mode, check for mock session in localStorage
    if (DEV_MODE) {
      const mockSession = localStorage.getItem('mock_session');
      if (mockSession) {
        const sessionData = JSON.parse(mockSession);
        setUser(sessionData.user as any);
        setProfile(sessionData.profile);
      }
      setLoading(false);
      return;
    }

    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      }

      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  const login = async (email: string, password: string) => {
    // Dev mode: accept any credentials
    if (DEV_MODE) {
      const mockUser = {
        id: MOCK_PARENT.id,
        email: MOCK_PARENT.email,
        aud: 'authenticated',
        role: 'authenticated',
      };
      const mockProfile = {
        id: MOCK_PARENT.id,
        full_name: MOCK_PARENT.name,
        role: MOCK_PARENT.role,
      };

      // Store in localStorage for persistence
      localStorage.setItem('mock_session', JSON.stringify({
        user: mockUser,
        profile: mockProfile,
      }));

      setUser(mockUser as any);
      setProfile(mockProfile);
      router.push('/dashboard');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      await fetchProfile(data.user.id);
      router.push('/dashboard');
    }
  };

  const loginChild = async (secretCode: string) => {
    // Dev mode: use mock children
    if (DEV_MODE) {
      const child = MOCK_CHILDREN.find(c => c.secretCode === secretCode.toUpperCase());

      if (!child) {
        throw new Error('Código secreto inválido');
      }

      // Store child info in localStorage
      localStorage.setItem('child_session', JSON.stringify(child));

      // Create mock user/profile for child
      const mockUser = {
        id: child.id,
        email: '',
        aud: 'authenticated',
        role: 'authenticated',
      };
      const mockProfile = {
        id: child.id,
        full_name: child.superheroName,
        role: 'CHILD',
      };

      localStorage.setItem('mock_session', JSON.stringify({
        user: mockUser,
        profile: mockProfile,
      }));

      setUser(mockUser as any);
      setProfile(mockProfile);
      router.push('/child-dashboard');
      return;
    }

    // Look up child by secret code
    const { data: child, error: childError } = await supabase
      .from('children')
      .select('*, archangel:archangels(*)')
      .eq('secret_code', secretCode.toUpperCase())
      .single();

    if (childError || !child) {
      throw new Error('Código secreto inválido');
    }

    // For now, store child info in localStorage and redirect
    // In production, you might create a special child session
    localStorage.setItem('child_session', JSON.stringify(child));
    router.push('/child-dashboard');
  };

  const register = async (name: string, email: string, password: string) => {
    // Dev mode: accept any registration
    if (DEV_MODE) {
      const mockUser = {
        id: MOCK_PARENT.id,
        email: email,
        aud: 'authenticated',
        role: 'authenticated',
      };
      const mockProfile = {
        id: MOCK_PARENT.id,
        full_name: name,
        role: 'PARENT',
      };

      // Store in localStorage for persistence
      localStorage.setItem('mock_session', JSON.stringify({
        user: mockUser,
        profile: mockProfile,
      }));

      setUser(mockUser as any);
      setProfile(mockProfile);
      router.push('/dashboard');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      // Profile is auto-created by trigger, but we can update it
      await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', data.user.id);

      await fetchProfile(data.user.id);
      router.push('/dashboard');
    }
  };

  const logout = async () => {
    if (DEV_MODE) {
      localStorage.removeItem('mock_session');
      localStorage.removeItem('child_session');
      setUser(null);
      setProfile(null);
      setSession(null);
      router.push('/login');
      return;
    }

    await supabase.auth.signOut();
    localStorage.removeItem('child_session');
    setUser(null);
    setProfile(null);
    setSession(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        login,
        loginChild,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
