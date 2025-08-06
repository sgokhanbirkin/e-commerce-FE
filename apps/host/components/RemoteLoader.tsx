'use client';

import { useEffect, useState, Suspense } from 'react';
import { Spin, Alert } from 'antd';
import { loadRemoteComponent, isRemoteAvailable } from '@data-access/federation-loader';

interface RemoteLoaderProps {
    remoteName: string;
    moduleName: string;
    fallback?: React.ReactNode;
    onError?: (error: Error) => void;
    [key: string]: any;
}

export function RemoteLoader({
    remoteName,
    moduleName,
    fallback,
    onError,
    ...props
}: RemoteLoaderProps) {
    const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadComponent = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if remote is available
                if (!isRemoteAvailable(remoteName)) {
                    throw new Error(`Remote ${remoteName} is not available`);
                }

                // Load the remote component
                const RemoteComponent = await loadRemoteComponent(remoteName, moduleName);
                setComponent(() => RemoteComponent);
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Failed to load remote component');
                setError(error);
                onError?.(error);
            } finally {
                setLoading(false);
            }
        };

        loadComponent();
    }, [remoteName, moduleName, onError]);

    if (loading) {
        return fallback || (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>
                    Loading {remoteName}/{moduleName}...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Remote Component Error"
                description={`Failed to load ${remoteName}/${moduleName}: ${error.message}`}
                type="error"
                showIcon
            />
        );
    }

    if (!Component) {
        return (
            <Alert
                message="Component Not Found"
                description={`Component ${moduleName} not found in remote ${remoteName}`}
                type="warning"
                showIcon
            />
        );
    }

    return (
        <Suspense fallback={fallback || <Spin />}>
            <Component {...props} />
        </Suspense>
    );
} 