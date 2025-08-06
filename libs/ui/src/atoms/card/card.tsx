import React from 'react';
import { Card as AntCard, CardProps as AntCardProps } from 'antd';

export interface CardProps extends Omit<AntCardProps, 'size' | 'variant'> {
    variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    variant = 'default',
    size = 'md',
    hoverable = false,
    children,
    className = '',
    ...props
}) => {
    const baseClassName = 'kayra-card';
    const variantClassName = `kayra-card--${variant}`;
    const sizeClassName = `kayra-card--${size}`;

    const combinedClassName = `${baseClassName} ${variantClassName} ${sizeClassName} ${className}`.trim();

    return (
        <AntCard
            hoverable={hoverable}
            className={combinedClassName}
            size={size as any}
            {...props}
        >
            {children}
        </AntCard>
    );
};

// Export card variants as separate components
export const ElevatedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
    <Card variant="elevated" {...props} />
);

export const OutlinedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
    <Card variant="outlined" {...props} />
);

export const GhostCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
    <Card variant="ghost" {...props} />
); 