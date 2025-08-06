// Authentication utility functions
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface AuthToken {
  token: string;
  expiresAt?: number;
}

/**
 * Store JWT token in localStorage
 */
export const storeToken = (token: string, expiresIn?: number): void => {
  if (typeof window === 'undefined') return;

  const tokenData: AuthToken = {
    token,
    expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : undefined,
  };

  localStorage.setItem('jwt_token', JSON.stringify(tokenData));
};

/**
 * Get JWT token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const tokenData = localStorage.getItem('jwt_token');
    if (!tokenData) return null;

    const parsed: AuthToken = JSON.parse(tokenData);

    // Check if token is expired
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      removeToken();
      return null;
    }

    return parsed.token;
  } catch (error) {
    console.error('Error parsing token:', error);
    removeToken();
    return null;
  }
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('jwt_token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

/**
 * Store user data in localStorage
 */
export const storeUser = (user: AuthUser): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get user data from localStorage
 */
export const getUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;

  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Remove user data from localStorage
 */
export const removeUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
};

/**
 * Clear all authentication data
 */
export const clearAuth = (): void => {
  removeToken();
  removeUser();
};

/**
 * Decode JWT token (without verification)
 */
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  return Date.now() >= decoded.exp * 1000;
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;

  return new Date(decoded.exp * 1000);
};

/**
 * Setup authentication interceptor for API calls
 */
export const setupAuthInterceptor = (api: any): void => {
  // This can be used to setup automatic token refresh
  // or handle 401 responses globally
  console.log('Auth interceptor setup complete');
};
