'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginChild: (secretCode: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Redirect logic based on auth state
  useEffect(() => {
    if (!loading) {
      const publicRoutes = ['/login', '/register', '/forgot-password', '/'];
      const isPublicRoute = publicRoutes.some(route => pathname === route);

      if (!user && !isPublicRoute) {
        // Not authenticated and trying to access protected route
        router.push('/login');
      } else if (user && (pathname === '/login' || pathname === '/register')) {
        // Already authenticated and on login/register page
        if (user.role === 'CHILD') {
          router.push('/child-dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [user, loading, pathname]);

  const checkAuth = async () => {
    const token = authApi.getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await authApi.getProfile();
      setUser(userData);
    } catch (error) {
      // Token is invalid
      authApi.removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    authApi.storeToken(response.token);
    setUser(response.user);

    // Redirect based on role
    if (response.user.role === 'CHILD') {
      router.push('/child-dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const loginChild = async (secretCode: string) => {
    const response = await authApi.loginChild({ secretCode });
    authApi.storeToken(response.token);
    setUser(response.user);
    router.push('/child-dashboard');
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authApi.register({ name, email, password });
    authApi.storeToken(response.token);
    setUser(response.user);
    router.push('/dashboard');
  };

  const logout = () => {
    authApi.removeToken();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
