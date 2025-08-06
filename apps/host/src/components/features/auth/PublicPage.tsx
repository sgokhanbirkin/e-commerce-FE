'use client';

import React from 'react';
import { withPublicRoute } from '../../../hooks/useAuth';

interface PublicPageProps {
  title?: string;
}

const PublicPageComponent: React.FC<PublicPageProps> = ({
  title = 'Public Page',
}) => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{title}</h1>

      <div
        style={{
          backgroundColor: '#e6f7ff',
          border: '1px solid #91d5ff',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '2rem',
        }}
      >
        <h3>Welcome to the Public Page!</h3>
        <p>
          This page is accessible to everyone, including unauthenticated users.
        </p>
        <p>
          If you&apos;re already logged in, you would be redirected to the
          dashboard.
        </p>
      </div>

      <div>
        <h3>Features</h3>
        <ul>
          <li>✅ Accessible to all users</li>
          <li>✅ Redirects authenticated users to dashboard</li>
          <li>✅ Shows loading state during auth check</li>
          <li>✅ Clean and simple interface</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Navigation</h3>
        <p>You can navigate to:</p>
        <ul>
          <li>
            <a href='/login' style={{ color: '#1890ff' }}>
              Login Page
            </a>
          </li>
          <li>
            <a href='/register' style={{ color: '#1890ff' }}>
              Register Page
            </a>
          </li>
          <li>
            <a href='/' style={{ color: '#1890ff' }}>
              Home Page
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Export the component wrapped with withPublicRoute HOC
export const PublicPage = withPublicRoute(PublicPageComponent);
