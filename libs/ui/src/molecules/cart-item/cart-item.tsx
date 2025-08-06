import React from 'react';
import { InputNumber, Space, Divider } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Card } from '../../atoms/card';
import { Button } from '../../atoms/button';
import { Typography } from '../../atoms/typography';
import type { CartItem as CartItemType } from '@data-access/types';

const { Title, Text } = Typography;

export interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity?: (productId: string, quantity: number) => void;
    onRemove?: (productId: string) => void;
    loading?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export const CartItem: React.FC<CartItemProps> = ({
    item,
    onUpdateQuantity,
    onRemove,
    loading = false,
    className = '',
    style,
}) => {
    const handleQuantityChange = (quantity: number | null) => {
        if (quantity !== null && quantity > 0) {
            onUpdateQuantity?.(item.productId, quantity);
        } else if (quantity === 0) {
            onRemove?.(item.productId);
        }
    };

    const handleRemove = () => {
        onRemove?.(item.productId);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const totalPrice = item.product.price * item.quantity;

    return (
        <Card
            className={`kayra-cart-item ${className}`.trim()}
            style={style}
            size="small"
        >
            <div className="kayra-cart-item__content">
                <div className="kayra-cart-item__image">
                    <img
                        src={item.product.image}
                        alt={item.product.title}
                        style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'contain',
                            borderRadius: '8px',
                        }}
                    />
                </div>

                <div className="kayra-cart-item__details">
                    <Title level={5} className="kayra-cart-item__title">
                        {item.product.title}
                    </Title>

                    <Text type="secondary" className="kayra-cart-item__category">
                        {item.product.category}
                    </Text>

                    <div className="kayra-cart-item__price">
                        <Text strong className="kayra-cart-item__unit-price">
                            {formatPrice(item.product.price)} each
                        </Text>
                    </div>
                </div>

                <div className="kayra-cart-item__quantity">
                    <Space direction="vertical" size="small">
                        <Text type="secondary">Quantity</Text>
                        <InputNumber
                            min={1}
                            max={99}
                            value={item.quantity}
                            onChange={handleQuantityChange}
                            loading={loading}
                            size="small"
                            style={{ width: '80px' }}
                        />
                    </Space>
                </div>

                <div className="kayra-cart-item__total">
                    <Title level={4} className="kayra-cart-item__total-price">
                        {formatPrice(totalPrice)}
                    </Title>
                </div>

                <div className="kayra-cart-item__actions">
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleRemove}
                        loading={loading}
                        size="small"
                    />
                </div>
            </div>
        </Card>
    );
};

// Export cart item variants
export const CompactCartItem: React.FC<CartItemProps> = (props) => (
    <CartItem
        {...props}
        className={`${props.className || ''} kayra-cart-item--compact`.trim()}
    />
);

export const DetailedCartItem: React.FC<CartItemProps> = (props) => (
    <CartItem
        {...props}
        className={`${props.className || ''} kayra-cart-item--detailed`.trim()}
    />
); 