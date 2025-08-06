// Custom authentication hooks
import { useCallback, useEffect } from 'react';
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
} from './api';
import { fetchOrCreateGuestToken } from './auth-utils';

// Import useAuth from context (this will be available in the host app)
declare function useAuth(): {
  isAuthenticated: boolean;
  profileLoading: boolean;
};

// Type definitions
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export function useEnsureGuestToken() {
  useEffect(() => {
    fetchOrCreateGuestToken();
  }, []);
}

export function useLogin() {
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await loginUser(credentials).unwrap();
        return result;
      } catch (err) {
        throw err;
      }
    },
    [loginUser]
  );

  return { login, isLoading, error };
}

export function useRegister() {
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();

  const register = useCallback(
    async (userData: RegisterCredentials) => {
      try {
        const result = await registerUser(userData).unwrap();
        return result;
      } catch (err) {
        throw err;
      }
    },
    [registerUser]
  );

  return { register, isLoading, error };
}

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
