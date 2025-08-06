'use client';

import React from 'react';
import { Card, Row, Col, Typography, Empty, Button, Tag, Space, Divider } from 'antd';
import { ShoppingOutlined, EyeOutlined, ClockCircleOutlined, CheckCircleOutlined, CarOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../../context';
import { useRouter } from 'next/navigation';
import { useGetOrdersQuery } from '@data-access/api';
import type { Order } from '@data-access/types';

const { Title, Text } = Typography;

const OrdersPage: React.FC = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { data: orders, isLoading } = useGetOrdersQuery();

    if (authLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Yükleniyor...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        router.push('/login');
        return null;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'orange';
            case 'processing':
                return 'blue';
            case 'shipped':
                return 'purple';
            case 'delivered':
                return 'green';
            case 'cancelled':
                return 'red';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <ClockCircleOutlined />;
            case 'processing':
                return <ClockCircleOutlined />;
            case 'shipped':
                return <CarOutlined />;
            case 'delivered':
                return <CheckCircleOutlined />;
            case 'cancelled':
                return <CloseCircleOutlined />;
            default:
                return <ClockCircleOutlined />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Beklemede';
            case 'processing':
                return 'İşleniyor';
            case 'shipped':
                return 'Kargoda';
            case 'delivered':
                return 'Teslim Edildi';
            case 'cancelled':
                return 'İptal Edildi';
            default:
                return status;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Title level={2} style={{ marginBottom: '32px' }}>
                Sipariş Geçmişi
            </Title>

            {isLoading ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div>Yükleniyor...</div>
                    </div>
                </Card>
            ) : orders && orders.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {orders.map((order) => (
                        <Col xs={24} key={order.id}>
                            <Card>
                                <Row gutter={[16, 16]} align="middle">
                                    <Col xs={24} sm={6}>
                                        <div>
                                            <Text strong>Sipariş #{order.id}</Text>
                                            <br />
                                            <Text type="secondary">
                                                {formatDate(order.createdAt || '')}
                                            </Text>
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={4}>
                                        <div style={{ textAlign: 'center' }}>
                                            <Text strong>{order.items?.length || 0}</Text>
                                            <br />
                                            <Text type="secondary">Ürün</Text>
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={4}>
                                        <div style={{ textAlign: 'center' }}>
                                            <Text strong>₺{order.totalPrice?.toFixed(2) || '0.00'}</Text>
                                            <br />
                                            <Text type="secondary">Toplam</Text>
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={6}>
                                        <div style={{ textAlign: 'center' }}>
                                            <Tag
                                                color={getStatusColor(order.status)}
                                                icon={getStatusIcon(order.status)}
                                                style={{ fontSize: '12px', padding: '4px 8px' }}
                                            >
                                                {getStatusText(order.status)}
                                            </Tag>
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={4}>
                                        <div style={{ textAlign: 'right' }}>
                                            <Button
                                                type="primary"
                                                icon={<EyeOutlined />}
                                                onClick={() => router.push(`/orders/${order.id}`)}
                                            >
                                                Detay
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Card>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Henüz sipariş bulunmuyor"
                    >
                        <Button
                            type="primary"
                            icon={<ShoppingOutlined />}
                            onClick={() => router.push('/')}
                        >
                            Alışverişe Başla
                        </Button>
                    </Empty>
                </Card>
            )}
        </div>
    );
};

export default OrdersPage; 