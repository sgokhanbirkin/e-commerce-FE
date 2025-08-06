'use client';

import React from 'react';
import { Spin, Typography } from 'antd';

const { Title } = Typography;

const PageLoader: React.FC = () => {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(255,255,255,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
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
                {/* Mavi Daire Container */}
                <div
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        backgroundColor: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        boxShadow: '0 8px 32px rgba(24, 144, 255, 0.3)',
                    }}
                >
                    {/* Spin Component */}
                    <Spin
                        size="large"
                        style={{
                            position: 'absolute',
                            color: 'white',
                        }}
                    />

                    {/* Kayra Export Text */}
                    <Title
                        level={3}
                        style={{
                            color: 'white',
                            margin: 0,
                            fontSize: '14px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            lineHeight: 1.2,
                            zIndex: 1,
                        }}
                    >
                        Kayra Export
                    </Title>
                </div>

                {/* Loading Text */}
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '16px',
                    }}
                >
                    <Title
                        level={4}
                        style={{
                            color: '#1890ff',
                            margin: 0,
                            marginBottom: '4px',
                        }}
                    >
                        Sayfa Yükleniyor
                    </Title>
                    <div
                        style={{
                            fontSize: '14px',
                            color: '#666',
                        }}
                    >
                        Lütfen bekleyin...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageLoader; 