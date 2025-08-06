import React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export interface ButtonProps extends Omit<AntButtonProps, 'size' | 'type' | 'variant'> {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    loading?: boolean;
    children: React.ReactNode;
}

const sizeMap = {
    xs: 'small',
    sm: 'small',
    md: 'middle',
    lg: 'middle',
    xl: 'large',
} as const;

const variantMap = {
    primary: 'primary',
    secondary: 'default',
    outline: 'default',
    ghost: 'text',
    danger: 'primary',
} as const;

export const Button: React.FC<ButtonProps> = ({
    size = 'md',
    variant = 'primary',
    loading = false,
    children,
    className = '',
    ...props
}) => {
    const antSize = sizeMap[size];
    const antType = variantMap[variant];

    const baseClassName = 'kayra-button';
    const variantClassName = `kayra-button--${variant}`;
    const sizeClassName = `kayra-button--${size}`;

    const combinedClassName = `${baseClassName} ${variantClassName} ${sizeClassName} ${className}`.trim();

    return (
        <AntButton
            type={antType as any}
            size={antSize}
            loading={loading}
            className={combinedClassName}
            icon={loading ? <LoadingOutlined /> : props.icon}
            {...props}
        >
            {children}
        </AntButton>
    );
};

// Export button variants as separate components
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="secondary" {...props} />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="outline" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="ghost" {...props} />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="danger" {...props} />
); 