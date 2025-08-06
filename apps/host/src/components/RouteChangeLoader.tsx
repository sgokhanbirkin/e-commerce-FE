'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import PageLoader from './PageLoader';

const RouteChangeLoader: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Pathname değişikliğini izle
    useEffect(() => {
        // Route değişikliği başladığında loading'i göster
        setLoading(true);

        // Kısa bir süre sonra loading'i gizle
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [pathname]);

    // Manuel navigation detection
    useEffect(() => {
        const handleStart = () => {
            setLoading(true);
        };

        const handleComplete = () => {
            setTimeout(() => {
                setLoading(false);
            }, 300);
        };

        // Next.js App Router navigation events
        if (typeof window !== 'undefined') {
            // Link tıklamalarını yakala
            const handleLinkClick = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                const link = target.closest('a');
                if (link && link.href && !link.href.startsWith('javascript:') && !link.href.startsWith('#')) {
                    setLoading(true);
                }
            };

            // Navigation start
            window.addEventListener('beforeunload', handleStart);
            window.addEventListener('click', handleLinkClick);

            // Navigation complete
            window.addEventListener('load', handleComplete);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('beforeunload', handleStart);
                window.removeEventListener('click', handleLinkClick);
                window.removeEventListener('load', handleComplete);
            }
        };
    }, []);

    if (!loading) return null;

    return <PageLoader />;
};

export default RouteChangeLoader; 