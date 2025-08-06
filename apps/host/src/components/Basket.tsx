'use client';

import React from 'react';
import {
  Card,
  Button,
  List,
  Typography,
  Spin,
  Alert,
  InputNumber,
  Space,
  Divider,
  App,
} from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import {
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from '@data-access/api';
import type { CartItem } from '@data-access/types';

const { Title, Text } = Typography;

interface BasketProps {
  cartItems?: CartItem[];
  isLoading?: boolean;
  error?: any;
}

export const Basket: React.FC<BasketProps> = ({
  cartItems = [],
  isLoading = false,
  error = null,
}) => {
  const [removeFromCart, { isLoading: removeLoading }] =
    useRemoveFromCartMutation();
  const [updateCartItem, { isLoading: updateLoading }] =
    useUpdateCartItemMutation();
  const { message } = App.useApp();

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      await removeFromCart(itemId).unwrap();
      message.success('Item removed from cart');
    } catch (error) {
      message.error('Failed to remove item from cart');
      console.error('Remove from cart error:', error);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    console.log('🔍 handleUpdateQuantity called with:', { itemId, quantity });

    if (quantity <= 0) {
      await handleRemoveFromCart(itemId);
      return;
    }

    try {
      console.log('🔍 Calling updateCartItem mutation...');
      const result = await updateCartItem({ itemId, quantity }).unwrap();
      console.log('🔍 updateCartItem success:', result);
      message.success('Cart updated');
    } catch (error) {
      console.error('🔍 updateCartItem error:', error);
      console.error('🔍 Error details:', {
        status: (error as any)?.status,
        data: (error as any)?.data,
        message: (error as any)?.message,
      });
      message.error('Failed to update cart');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.variant?.price ?? item.product?.price ?? 0;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCategoryName = (item: CartItem) => {
    // Backend'den gelen örnek: "category": { "id": 11, "name": "Electronics", "parentId": null }
    if (item.product?.category && typeof item.product.category === 'object') {
      const categoryObj = item.product.category as any;
      if (categoryObj.name) {
        return categoryObj.name;
      }
    }
    // String olarak gelirse
    if (typeof item.product?.category === 'string') {
      return item.product.category;
    }
    return 'Uncategorized';
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size='large' />
        <div style={{ marginTop: '16px' }}>
          <Text type='secondary'>Loading cart...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message='Error Loading Cart'
        description={typeof error === 'string' ? error : JSON.stringify(error)}
        type='error'
        showIcon
        style={{ marginBottom: '16px' }}
      />
    );
  }

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
                loading={removeLoading}
                onClick={() => handleRemoveFromCart(item.id)}
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
                    src={
                      item.product?.imageUrl ||
                      'https://via.placeholder.com/60x60?text=No+Image'
                    }
                    alt={item.product?.title || 'Product'}
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
                  <Text strong>{item.product?.title || 'Unknown Product'}</Text>
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
                    {item.product?.description
                      ? item.product.description.length > 80
                        ? `${item.product.description.substring(0, 80)}...`
                        : item.product.description
                      : 'No description available'}
                  </Text>
                  <div style={{ marginTop: '8px' }}>
                    <Text type='secondary' style={{ fontSize: '12px' }}>
                      Category: {getCategoryName(item)}
                    </Text>
                  </div>
                </div>
              }
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div>
                <Text strong>
                  $
                  {(item.variant?.price ?? item.product?.price ?? 0).toFixed(2)}
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
                      handleUpdateQuantity(item.id, value || 1)
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
                    (item.variant?.price ?? item.product?.price ?? 0) *
                    item.quantity
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
          <Button type='primary' size='large'>
            Proceed to Checkout
          </Button>
        </div>
      </Card>
    </div>
  );
};
