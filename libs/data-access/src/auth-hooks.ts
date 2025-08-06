// Custom authentication hooks
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
} from './api';
import { fetchOrCreateGuestToken } from './auth-utils';
import { App } from 'antd';

export function useEnsureGuestToken() {
  useEffect(() => {
    fetchOrCreateGuestToken();
  }, []);
}

export function useLogin() {
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const router = useRouter();
  const { message } = App.useApp();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const { data } = await loginUser(credentials).unwrap();
        message.success('Login successful!');
        router.push('/');
      } catch (err) {
        message.error('Login failed. Please check your credentials.');
        console.error('Login error:', err);
      }
    },
    [loginUser, router, message]
  );

  return { login, isLoading, error };
}

export function useRegister() {
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();
  const router = useRouter();
  const { message } = App.useApp();

  const register = useCallback(
    async (userData: RegisterCredentials) => {
      try {
        const { data } = await registerUser(userData).unwrap();
        message.success('Registration successful!');
        router.push('/');
      } catch (err) {
        message.error('Registration failed. Please try again.');
        console.error('Registration error:', err);
      }
    },
    [registerUser, router, message]
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
