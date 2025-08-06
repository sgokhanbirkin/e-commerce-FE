import React from 'react';
import { List, Empty, Spin, Divider, Space } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { CartItem } from '../../molecules/cart-item';
import { Button } from '../../atoms/button';
import { Typography } from '../../atoms/typography';
import type { CartItem as CartItemType } from '@data-access/types';

const { Title, Text } = Typography;

export interface CartListProps {
    items: CartItemType[];
    loading?: boolean;
    onUpdateQuantity?: (productId: string, quantity: number) => void;
    onRemove?: (productId: string) => void;
    onClearCart?: () => void;
    onCheckout?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const CartList: React.FC<CartListProps> = ({
    items,
    loading = false,
    onUpdateQuantity,
    onRemove,
    onClearCart,
    onCheckout,
    className = '',
    style,
}) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const calculateItemCount = () => {
        return items.reduce((count, item) => count + item.quantity, 0);
    };

    const total = calculateTotal();
    const itemCount = calculateItemCount();

    if (loading) {
        return (
            <div className={`kayra-cart-list kayra-cart-list--loading ${className}`.trim()} style={style}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: '16px' }}>Loading cart...</div>
                </div>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className={`kayra-cart-list kayra-cart-list--empty ${className}`.trim()} style={style}>
                <Empty
                    image={<ShoppingCartOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
                    description="Your cart is empty"
                >
                    <Button type="primary" onClick={onCheckout}>
                        Start Shopping
                    </Button>
                </Empty>
            </div>
        );
    }

    return (
        <div className={`kayra-cart-list ${className}`.trim()} style={style}>
            <div className="kayra-cart-list__header">
                <Title level={4} className="kayra-cart-list__title">
                    Shopping Cart ({itemCount} items)
                </Title>

                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={onClearCart}
                    size="small"
                >
                    Clear Cart
                </Button>
            </div>

            <List
                className="kayra-cart-list__items"
                itemLayout="vertical"
                dataSource={items}
                renderItem={(item) => (
                    <List.Item key={item.productId} className="kayra-cart-list__item">
                        <CartItem
                            item={item}
                            onUpdateQuantity={onUpdateQuantity}
                            onRemove={onRemove}
                            loading={loading}
                        />
                    </List.Item>
                )}
            />

            <Divider />

            <div className="kayra-cart-list__summary">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div className="kayra-cart-list__totals">
                        <div className="kayra-cart-list__total-row">
                            <Text>Subtotal ({itemCount} items):</Text>
                            <Text strong>{formatPrice(total)}</Text>
                        </div>

                        <div className="kayra-cart-list__total-row">
                            <Text>Shipping:</Text>
                            <Text>Free</Text>
                        </div>

                        <Divider />

                        <div className="kayra-cart-list__total-row">
                            <Title level={4}>Total:</Title>
                            <Title level={4}>{formatPrice(total)}</Title>
                        </div>
                    </div>

                    <div className="kayra-cart-list__actions">
                        <Space size="middle" style={{ width: '100%' }}>
                            <Button
                                type="default"
                                onClick={onClearCart}
                                block
                            >
                                Continue Shopping
                            </Button>

                            <Button
                                type="primary"
                                onClick={onCheckout}
                                block
                                size="large"
                            >
                                Proceed to Checkout
                            </Button>
                        </Space>
                    </div>
                </Space>
            </div>
        </div>
    );
};

// Export cart list variants
export const CompactCartList: React.FC<CartListProps> = (props) => (
    <CartList
        {...props}
        className={`${props.className || ''} kayra-cart-list--compact`.trim()}
    />
);

export const DetailedCartList: React.FC<CartListProps> = (props) => (
    <CartList
        {...props}
        className={`${props.className || ''} kayra-cart-list--detailed`.trim()}
    />
); 