'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { withAuth } from '../context/AuthContext';

interface ProtectedPageProps {
  title?: string;
}

const ProtectedPageComponent: React.FC<ProtectedPageProps> = ({ title = 'Protected Page' }) => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

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

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '1px solid #d9d9d9',
        paddingBottom: '1rem'
      }}>
        <h1>{title}</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#f5222d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{
        backgroundColor: '#f6ffed',
        border: '1px solid #b7eb8f',
        padding: '1rem',
        borderRadius: '4px',
        marginBottom: '2rem'
      }}>
        <h3>Welcome, {user?.name || 'User'}!</h3>
        <p>This is a protected page. You can only see this if you're authenticated.</p>
        <p>Email: {user?.email}</p>
      </div>

      <div>
        <h3>User Information</h3>
        <pre style={{
          backgroundColor: '#f5f5f5',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// Export the component wrapped with withAuth HOC
export const ProtectedPage = withAuth(ProtectedPageComponent); 