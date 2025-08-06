'use client';

import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingSpinnerProps {
    size?: 'small' | 'default' | 'large';
    text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    text = 'Kayra Export'
}) => {
    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: size === 'large' ? 48 : size === 'default' ? 32 : 24,
                color: '#1890ff',
            }}
            spin
        />
    );

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                backdropFilter: 'blur(4px)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                }}
            >
                {/* Logo Container */}
                <div
                    style={{
                        width: size === 'large' ? 120 : size === 'default' ? 80 : 60,
                        height: size === 'large' ? 120 : size === 'default' ? 80 : 60,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(24, 144, 255, 0.3)',
                        position: 'relative',
                    }}
                >
                    {/* Spinner */}
                    <Spin
                        indicator={antIcon}
                        style={{
                            color: 'white',
                        }}
                    />

                    {/* Inner Circle */}
                    <div
                        style={{
                            position: 'absolute',
                            width: size === 'large' ? 80 : size === 'default' ? 60 : 40,
                            height: size === 'large' ? 80 : size === 'default' ? 60 : 40,
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <span
                            style={{
                                fontSize: size === 'large' ? 12 : size === 'default' ? 10 : 8,
                                fontWeight: 'bold',
                                color: '#1890ff',
                                textAlign: 'center',
                                lineHeight: 1,
                            }}
                        >
                            KE
                        </span>
                    </div>
                </div>

                {/* Text */}
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '16px',
                    }}
                >
                    <div
                        style={{
                            fontSize: size === 'large' ? 24 : size === 'default' ? 20 : 16,
                            fontWeight: 'bold',
                            color: '#1890ff',
                            marginBottom: '4px',
                        }}
                    >
                        {text}
                    </div>
                    <div
                        style={{
                            fontSize: size === 'large' ? 14 : size === 'default' ? 12 : 10,
                            color: '#666',
                        }}
                    >
                        Yükleniyor...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner; 