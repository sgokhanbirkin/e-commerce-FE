'use client';

import React from 'react';
import {
  Card,
  Button,
  List,
  Typography,
  Space,
  Divider,
  InputNumber,
} from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import type { CartItem } from '@data-access/types';

const { Title, Text } = Typography;

interface BasketProps {
  cartItems?: CartItem[];
  onRemoveItem?: (productId: string) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onClearBasket?: () => void;
}

export const Basket: React.FC<BasketProps> = ({
  cartItems = [],
  onRemoveItem,
  onUpdateQuantity,
  onClearBasket,
}) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.variant?.price || item.product.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <ShoppingCartOutlined
          style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }}
        />
        <Title level={4} type='secondary'>
          Your cart is empty
        </Title>
        <Text type='secondary'>Add some products to get started!</Text>
      </div>
    );
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: '24px' }}>
        Shopping Cart ({calculateTotalItems()} items)
      </Title>

      <List
        itemLayout='horizontal'
        dataSource={cartItems}
        renderItem={item => (
          <List.Item
            actions={[
              <Button
                key='remove'
                type='text'
                danger
                icon={<DeleteOutlined />}
                onClick={() => onRemoveItem?.(item.productId)}
                size='small'
              >
                Remove
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML =
                        '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 12px;">No Image</div>';
                    }}
                  />
                </div>
              }
              title={
                <div>
                  <Text strong>{item.product.title}</Text>
                  {item.variant && (
                    <Text type='secondary' style={{ marginLeft: '8px' }}>
                      ({item.variant.name}: {item.variant.value})
                    </Text>
                  )}
                </div>
              }
              description={
                <div>
                  <Text type='secondary' style={{ fontSize: '12px' }}>
                    {item.product.description.length > 80
                      ? `${item.product.description.substring(0, 80)}...`
                      : item.product.description}
                  </Text>
                  <div style={{ marginTop: '8px' }}>
                    <Text type='secondary' style={{ fontSize: '12px' }}>
                      Category:{' '}
                      {typeof item.product.category === 'string'
                        ? item.product.category
                        : item.product.category?.name || 'Uncategorized'}
                    </Text>
                  </div>
                </div>
              }
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div>
                <Text strong>
                  ${(item.variant?.price || item.product.price).toFixed(2)}
                </Text>
              </div>
              <div>
                <Space>
                  <Text>Qty:</Text>
                  <InputNumber
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={value =>
                      onUpdateQuantity?.(item.productId, value || 1)
                    }
                    size='small'
                    style={{ width: '60px' }}
                  />
                </Space>
              </div>
              <div>
                <Text strong>
                  $
                  {(
                    (item.variant?.price || item.product.price) * item.quantity
                  ).toFixed(2)}
                </Text>
              </div>
            </div>
          </List.Item>
        )}
      />

      <Divider />

      <Card style={{ background: '#fafafa' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <Text strong>Total Items: {calculateTotalItems()}</Text>
            <br />
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              Total: ${calculateTotal().toFixed(2)}
            </Title>
          </div>
          <Space>
            {onClearBasket && (
              <Button onClick={onClearBasket} danger>
                Clear Cart
              </Button>
            )}
            <Button type='primary' size='large'>
              Proceed to Checkout
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};
