'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { withPublicRoute } from '../../context/AuthContext';

const { Title, Text } = Typography;

interface LoginFormData {
    email: string;
    password: string;
}

const LoginPageComponent: React.FC = () => {
    const router = useRouter();
    const { login, isLoading } = useAuth();
    const [form] = Form.useForm();

    const onFinish = async (values: LoginFormData) => {
        try {
            const success = await login(values.email, values.password);

            if (success) {
                message.success('Login successful!');
                router.push('/'); // Redirect to home page
            } else {
                message.error('Invalid email or password');
            }
        } catch (error) {
            message.error('Login failed. Please try again.');
            console.error('Login error:', error);
        }
    };

    const handleRegisterClick = () => {
        router.push('/register');
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Title level={2} style={{ marginBottom: '8px', color: '#1890ff' }}>
                        Welcome Back
                    </Title>
                    <Text type="secondary">
                        Sign in to your account to continue
                    </Text>
                </div>

                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter your email"
                            autoComplete="email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please enter your password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            icon={<LoginOutlined />}
                            style={{
                                width: '100%',
                                height: '48px',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <Text type="secondary">
                        Don't have an account?{' '}
                        <Button
                            type="link"
                            onClick={handleRegisterClick}
                            style={{ padding: 0, height: 'auto' }}
                        >
                            Sign up here
                        </Button>
                    </Text>
                </div>

                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    backgroundColor: '#f6ffed',
                    borderRadius: '8px',
                    border: '1px solid #b7eb8f'
                }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        <strong>Demo Credentials:</strong><br />
                        Email: user@example.com<br />
                        Password: password123
                    </Text>
                </div>
            </Card>
        </div>
    );
};

// Export with public route protection
export default withPublicRoute(LoginPageComponent); 