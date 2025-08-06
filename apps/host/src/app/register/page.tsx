'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useRegisterUserMutation } from '@data-access/api';
import { withPublicRoute } from '../../context/AuthContext';

const { Title, Text } = Typography;

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterPageComponent: React.FC = () => {
    const router = useRouter();
    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const [form] = Form.useForm();

    const onFinish = async (values: RegisterFormData) => {
        try {
            const result = await registerUser({
                name: values.name,
                email: values.email,
                password: values.password,
            }).unwrap();

            if (result) {
                message.success('Registration successful! Please sign in.');
                router.push('/login'); // Redirect to login page
            }
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'Registration failed. Please try again.';
            message.error(errorMessage);
            console.error('Registration error:', error);
        }
    };

    const handleLoginClick = () => {
        router.push('/login');
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
                    maxWidth: '450px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Title level={2} style={{ marginBottom: '8px', color: '#1890ff' }}>
                        Create Account
                    </Title>
                    <Text type="secondary">
                        Join us and start shopping today
                    </Text>
                </div>

                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[
                            { required: true, message: 'Please enter your full name!' },
                            { min: 2, message: 'Name must be at least 2 characters!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter your full name"
                            autoComplete="name"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Enter your email"
                            autoComplete="email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please enter your password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number!'
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter your password"
                            autoComplete="new-password"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            icon={<UserAddOutlined />}
                            style={{
                                width: '100%',
                                height: '48px',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <Text type="secondary">
                        Already have an account?{' '}
                        <Button
                            type="link"
                            onClick={handleLoginClick}
                            style={{ padding: 0, height: 'auto' }}
                        >
                            Sign in here
                        </Button>
                    </Text>
                </div>

                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    backgroundColor: '#fff7e6',
                    borderRadius: '8px',
                    border: '1px solid #ffd591'
                }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        <strong>Password Requirements:</strong><br />
                        • At least 6 characters long<br />
                        • Contains uppercase and lowercase letters<br />
                        • Contains at least one number
                    </Text>
                </div>
            </Card>
        </div>
    );
};

// Export with public route protection
export default withPublicRoute(RegisterPageComponent); 