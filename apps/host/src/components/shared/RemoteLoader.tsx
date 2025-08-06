'use client';

import React, { useEffect, useState } from 'react';
import { Spin, Alert } from 'antd';

interface RemoteLoaderProps {
  remoteName: string;
  moduleName: string;
  fallback?: React.ReactNode;
  props?: Record<string, any>;
}

export const RemoteLoader: React.FC<RemoteLoaderProps> = ({
  remoteName,
  moduleName,
  fallback,
  props = {},
}) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRemoteComponent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dynamic import of the remote component
        const remoteModule = await import(
          /* webpackIgnore: true */ `${remoteName}${moduleName}`
        );
        const RemoteComponent = remoteModule.default || remoteModule;

        if (typeof RemoteComponent === 'function') {
          setComponent(() => RemoteComponent);
        } else {
          throw new Error(`Invalid component from ${remoteName}${moduleName}`);
        }
      } catch (err) {
        console.error(
          `Failed to load remote component from ${remoteName}${moduleName}:`,
          err
        );
        setError(
          `Failed to load ${remoteName} component. Please try again later.`
        );
      } finally {
        setLoading(false);
      }
    };

    loadRemoteComponent();
  }, [remoteName, moduleName]);

  if (loading) {
    return (
      <div
        style={{
          padding: '24px',
          border: '2px dashed #d9d9d9',
          borderRadius: '8px',
          textAlign: 'center',
          background: '#fafafa',
        }}
      >
        <Spin size='large' />
        <div style={{ marginTop: '16px' }}>
          Loading {remoteName} component...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message='Component Load Error'
        description={error}
        type='error'
        showIcon
        style={{ marginBottom: '16px' }}
      />
    );
  }

  if (!Component) {
    return (
      fallback || (
        <div
          style={{
            padding: '24px',
            border: '2px dashed #d9d9d9',
            borderRadius: '8px',
            textAlign: 'center',
            background: '#fafafa',
          }}
        >
          <div>Component not available</div>
        </div>
      )
    );
  }

  return <Component {...props} />;
};
