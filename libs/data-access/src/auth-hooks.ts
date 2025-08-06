// Custom authentication hooks
import { useCallback } from 'react';
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
} from './api';
import {
  isAuthenticated,
  getUser,
  clearAuth,
  storeToken,
  storeUser,
} from './auth-utils';
import type { AuthUser } from './auth-utils';

/**
 * Custom hook for authentication state
 */
export const useAuth = () => {
  const [login, loginState] = useLoginUserMutation();
  const [register, registerState] = useRegisterUserMutation();
  const [logout, logoutState] = useLogoutMutation();
  const [refreshToken, refreshState] = useRefreshTokenMutation();
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery(
    undefined,
    { skip: !isAuthenticated() }
  );

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await login({ email, password }).unwrap();
        return result;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    [login]
  );

  const handleRegister = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        const result = await register({ email, password, name }).unwrap();
        return result;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },
    [register]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout().unwrap();
      clearAuth();
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear auth data even if API call fails
      clearAuth();
    }
  }, [logout]);

  const handleRefreshToken = useCallback(async () => {
    try {
      const result = await refreshToken().unwrap();
      return result;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }, [refreshToken]);

  return {
    // State
    isAuthenticated: isAuthenticated(),
    user: getUser(),
    profile,
    profileLoading,

    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken: handleRefreshToken,

    // Loading states
    loginLoading: loginState.isLoading,
    registerLoading: registerState.isLoading,
    logoutLoading: logoutState.isLoading,
    refreshLoading: refreshState.isLoading,

    // Error states
    loginError: loginState.error,
    registerError: registerState.error,
    logoutError: logoutState.error,
    refreshError: refreshState.error,
  };
};

/**
 * Custom hook for protected routes
 */
export const useProtectedRoute = (redirectTo?: string) => {
  const { isAuthenticated, profileLoading } = useAuth();

  return {
    isAuthenticated,
    isLoading: profileLoading,
    shouldRedirect: !isAuthenticated && !profileLoading,
    redirectTo: redirectTo || '/login',
  };
};

/**
 * Custom hook for authentication guards
 */
export const useAuthGuard = () => {
  const { isAuthenticated, profileLoading } = useAuth();

  return {
    isAuthenticated,
    isLoading: profileLoading,
    isReady: !profileLoading,
  };
};
