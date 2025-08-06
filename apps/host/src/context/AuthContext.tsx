'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginUserMutation, useLogoutMutation, useGetProfileQuery } from '@data-access/api';
import { getToken, getUser, clearAuth, storeToken, storeUser } from '@data-access/auth-utils';
import type { User } from '@data-access/types';

// Auth context interface
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // RTK Query hooks
  const [loginUser, loginState] = useLoginUserMutation();
  const [logoutUser, logoutState] = useLogoutMutation();
  const { data: profileData, refetch: refetchProfile } = useGetProfileQuery(undefined, {
    skip: !token, // Skip if no token
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getToken();
      const storedUser = getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Update user when profile data changes
  useEffect(() => {
    if (profileData) {
      setUser(profileData);
      storeUser(profileData);
    }
  }, [profileData]);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await loginUser({ email, password }).unwrap();

      // Store token and user data
      storeToken(result.token);
      storeUser(result.user);

      setToken(result.token);
      setUser(result.user);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Call logout API
      await logoutUser().unwrap();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      // Clear local auth state regardless of API call result
      clearAuth();
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    if (token) {
      try {
        await refetchProfile();
      } catch (error) {
        console.error('Failed to refresh user data:', error);
        // If refresh fails, logout user
        await logout();
      }
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading: isLoading || loginState.isLoading || logoutState.isLoading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// HOC for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated, isLoading, router]);

    // Show loading while checking auth
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <div>Loading...</div>
        </div>
      );
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
      return null; // Will redirect in useEffect
    }

    // Render component if authenticated
    return <Component {...props} />;
  };

  // Set display name for debugging
  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

  return AuthenticatedComponent;
};

// HOC for public routes (redirect if already authenticated)
export const withPublicRoute = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const PublicComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && isAuthenticated) {
        router.push('/dashboard'); // or wherever authenticated users should go
      }
    }, [isAuthenticated, isLoading, router]);

    // Show loading while checking auth
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <div>Loading...</div>
        </div>
      );
    }

    // Redirect if already authenticated
    if (isAuthenticated) {
      return null; // Will redirect in useEffect
    }

    // Render component if not authenticated
    return <Component {...props} />;
  };

  // Set display name for debugging
  PublicComponent.displayName = `withPublicRoute(${Component.displayName || Component.name})`;

  return PublicComponent;
};

// Utility hook for conditional rendering based on auth state
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return false;
    }
    return true;
  };

  const requireGuest = () => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
      return false;
    }
    return true;
  };

  return {
    requireAuth,
    requireGuest,
    isAuthenticated,
    isLoading,
  };
}; 