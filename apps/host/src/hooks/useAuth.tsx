'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  useLoginUserMutation,
  useLogoutMutation,
  useGetProfileQuery,
} from '@data-access/api';
import {
  getToken,
  getUser,
  clearAuth,
  storeToken,
  storeUser,
} from '@data-access/auth-utils';
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
  const [mounted, setMounted] = useState(false);

  // Skip profile query if no token
  const shouldSkipProfile = !token;

  // RTK Query hooks
  const [loginUser, loginState] = useLoginUserMutation();
  const [logoutUser, logoutState] = useLogoutMutation();
  const {
    data: profileData,
    refetch: refetchProfile,
    isLoading: isProfileLoading,
  } = useGetProfileQuery(undefined, {
    skip: shouldSkipProfile, // Skip if no token
  });

  // Debug profile query
  // console.log('Profile Query Debug:', {
  //   token: token ? 'exists' : 'null',
  //   profileData,
  //   skip: shouldSkipProfile,
  // });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      // console.log('🔐 Starting AuthContext initialization...');

      const storedToken = getToken();
      const storedUser = getUser();

      // console.log('🔐 AuthContext Initialize:', {
      //   storedToken: storedToken ? 'exists' : 'null',
      //   storedUser: storedUser ? 'exists' : 'null',
      //   tokenLength: storedToken?.length,
      // });

      if (storedToken) {
        // console.log(
        //   '🔐 Setting token from localStorage:',
        //   `${storedToken.substring(0, 20)}...`
        // );
        setToken(storedToken);

        if (storedUser) {
          // console.log('🔐 Setting user from localStorage');
          // Convert AuthUser to User type
          const user: User = {
            id: parseInt(storedUser.id),
            email: storedUser.email,
            name: storedUser.name,
            firstName: storedUser.name?.split(' ')[0],
            lastName: storedUser.name?.split(' ').slice(1).join(' ') || '',
            phone: '',
          };
          setUser(user);
        }
      } else {
        // console.log('🔐 No token found in localStorage');
      }

      // Hızlı başlatma - loading'i hemen kapat
      setIsLoading(false);
      setMounted(true);
    };

    // Hemen çalıştır
    initializeAuth();
  }, []);

  // Force loading to false after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50); // Daha hızlı

    return () => clearTimeout(timer);
  }, []);

  // Debug loading state
  // useEffect(() => {
  //   console.log('Loading state changed:', isLoading);
  // }, [isLoading]);

  // Update user when profile data changes
  useEffect(() => {
    if (profileData) {
      console.log('Profile data received:', profileData);
      setUser(profileData);
      storeUser(profileData);
    }
  }, [profileData]);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await loginUser({ email, password }).unwrap();

      // console.log('🔐 Login Success:', {
      //   token: result.token ? 'exists' : 'null',
      //   user: result.user,
      //   tokenLength: result.token?.length,
      // });

      // Store token and user data immediately
      storeToken(result.token);
      storeUser(result.user);

      // Update state immediately
      // console.log(
      //   '🔐 Setting token in AuthContext:',
      //   result.token ? 'exists' : 'null'
      // );
      setToken(result.token);
      setUser(result.user);

      // Close loading immediately
      setIsLoading(false);

      // Force profile refetch after token update
      if (result.token) {
        // Small delay to ensure token is set
        setTimeout(() => {
          refetchProfile().catch(error => {
            // console.log('Profile fetch failed, but login successful:', error);
          });
        }, 200);
      }

      return true;
    } catch (error) {
      // console.error('Login failed:', error);
      setIsLoading(false);
      return false;
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
    isAuthenticated: mounted && !!token, // SSR için mounted kontrolü
    isLoading:
      !mounted || isLoading || loginState.isLoading || logoutState.isLoading,
    login,
    logout,
    refreshUser,
  };

  // Debug context value
  // console.log('🔐 AuthContext Value:', {
  //   user: user ? 'exists' : 'null',
  //   token: token ? 'exists' : 'null',
  //   isAuthenticated: !!token,
  //   tokenLength: token?.length,
  // });

  // Debug logging
  // console.log('AuthContext Debug:', {
  //   user,
  //   token: token ? 'exists' : 'null',
  //   isAuthenticated: !!token && !!user,
  //   isLoading: isLoading || loginState.isLoading || logoutState.isLoading,
  // });

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
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
  const AuthenticatedComponent: React.FC<P> = props => {
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
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
  const PublicComponent: React.FC<P> = props => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && isAuthenticated) {
        router.push('/'); // Redirect to home page
      }
    }, [isAuthenticated, isLoading, router]);

    // Show loading while checking auth
    if (isLoading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
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
