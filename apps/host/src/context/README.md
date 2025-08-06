# AuthContext Documentation

## Overview

The AuthContext provides a comprehensive authentication system for the host application, including:

- **React Context/Provider**: Manages authentication state globally
- **HOCs**: Higher-Order Components for route protection
- **Custom Hooks**: Easy access to auth functionality
- **Automatic Token Management**: Handles JWT tokens and user data

## Features

### ✅ Authentication State Management

- User data and token storage
- Automatic token validation
- Loading states for auth operations
- Error handling for failed requests

### ✅ Route Protection

- `withAuth`: Protects routes requiring authentication
- `withPublicRoute`: Redirects authenticated users from public routes
- Automatic redirects based on auth state

### ✅ Utility Functions

- `useAuth`: Access auth context in components
- `useAuthGuard`: Conditional rendering based on auth state
- Login/logout functions with error handling

## Usage Examples

### 1. Setting up AuthProvider

```tsx
// app/layout.tsx
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Using useAuth Hook

```tsx
import { useAuth } from '@/context/AuthContext';

function UserProfile() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h2>Welcome, {user?.name}!</h2>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Please login</h2>
          {/* Login form */}
        </div>
      )}
    </div>
  );
}
```

### 3. Protected Routes with withAuth

```tsx
import { withAuth } from '@/context/AuthContext';

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>This page is only visible to authenticated users.</p>
    </div>
  );
}

// Export with protection
export default withAuth(DashboardPage);
```

### 4. Public Routes with withPublicRoute

```tsx
import { withPublicRoute } from '@/context/AuthContext';

function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <p>This page is only visible to unauthenticated users.</p>
    </div>
  );
}

// Export with public route protection
export default withPublicRoute(LoginPage);
```

### 5. Conditional Rendering with useAuthGuard

```tsx
import { useAuthGuard } from '@/context/AuthContext';

function ConditionalComponent() {
  const { requireAuth, requireGuest, isAuthenticated } = useAuthGuard();

  const handleProtectedAction = () => {
    if (requireAuth()) {
      // User is authenticated, proceed with action
      console.log('Protected action executed');
    }
    // If not authenticated, user will be redirected to login
  };

  const handlePublicAction = () => {
    if (requireGuest()) {
      // User is not authenticated, proceed with action
      console.log('Public action executed');
    }
    // If authenticated, user will be redirected to dashboard
  };

  return (
    <div>
      <button onClick={handleProtectedAction}>Protected Action</button>
      <button onClick={handlePublicAction}>Public Action</button>
    </div>
  );
}
```

### 6. Login Form Implementation

```tsx
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

function LoginForm() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(email, password);
    if (success) {
      // Redirect or show success message
      console.log('Login successful');
    } else {
      // Show error message
      console.log('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder='Email'
        disabled={isLoading}
      />
      <input
        type='password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder='Password'
        disabled={isLoading}
      />
      <button type='submit' disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## API Reference

### AuthProvider Props

```tsx
interface AuthProviderProps {
  children: ReactNode;
}
```

### useAuth Hook

```tsx
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
```

### withAuth HOC

```tsx
function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P>;
```

**Features:**

- Automatically redirects to `/login` if not authenticated
- Shows loading state while checking authentication
- Only renders component if user is authenticated

### withPublicRoute HOC

```tsx
function withPublicRoute<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P>;
```

**Features:**

- Automatically redirects to `/dashboard` if already authenticated
- Shows loading state while checking authentication
- Only renders component if user is not authenticated

### useAuthGuard Hook

```tsx
interface AuthGuardReturn {
  requireAuth: () => boolean;
  requireGuest: () => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Methods:**

- `requireAuth()`: Returns true if authenticated, redirects to login if not
- `requireGuest()`: Returns true if not authenticated, redirects to dashboard if authenticated

## Error Handling

The AuthContext includes comprehensive error handling:

1. **Login Failures**: Returns false and allows custom error handling
2. **Token Expiration**: Automatically logs out user and redirects to login
3. **API Failures**: Graceful degradation with local state clearing
4. **Network Errors**: Proper error messages and fallback behavior

## Security Features

- **JWT Token Management**: Automatic token storage and retrieval
- **Token Validation**: Checks token validity on app initialization
- **Automatic Logout**: Logs out user on token expiration or API failures
- **Route Protection**: Prevents unauthorized access to protected routes
- **State Persistence**: Maintains auth state across page refreshes

## Best Practices

1. **Always wrap your app with AuthProvider** in the root layout
2. **Use withAuth for protected routes** instead of manual checks
3. **Use withPublicRoute for login/register pages** to prevent authenticated access
4. **Handle loading states** in your components
5. **Provide user feedback** for login/logout operations
6. **Use useAuthGuard for conditional actions** instead of manual redirects

## Integration with RTK Query

The AuthContext integrates seamlessly with RTK Query:

- **Automatic Token Injection**: JWT tokens are automatically included in API requests
- **Token Refresh**: Handles token refresh on API failures
- **Cache Invalidation**: Automatically invalidates cache on logout
- **Error Handling**: Handles API errors and authentication failures

## Example File Structure

```
src/
├── context/
│   ├── AuthContext.tsx    # Main auth context
│   ├── index.ts          # Exports
│   └── README.md         # This documentation
├── components/
│   ├── LoginForm.tsx     # Login form example
│   ├── ProtectedPage.tsx # Protected page example
│   ├── PublicPage.tsx    # Public page example
│   └── index.ts          # Component exports
└── app/
    ├── layout.tsx        # Root layout with AuthProvider
    ├── login/
    │   └── page.tsx      # Login page with withPublicRoute
    ├── dashboard/
    │   └── page.tsx      # Dashboard with withAuth
    └── page.tsx          # Home page
```
