'use client';

import React from 'react';
import { Card, Button, Typography, message } from 'antd';
import { ShoppingCartOutlined, StarOutlined } from '@ant-design/icons';
import { useAddToCartMutation } from '@data-access/api';
import type { Product } from '@data-access/types';

const { Text } = Typography;

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [addToCart, { isLoading: addToCartLoading }] = useAddToCartMutation();

  const handleAddToCart = async () => {
    try {
      await addToCart({
        variantId: product.id,
        quantity: 1,
      }).unwrap();

      message.success(`${product.title} added to cart!`);
    } catch (error) {
      message.error('Failed to add product to cart');
      console.error('Add to cart error:', error);
    }
  };

  return (
    <Card
      hoverable
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      cover={
        <div
          style={{
            height: '200px',
            background: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            alt={product.title}
            src={product.imageUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        </div>
      }
      actions={[
        <Button
          key='add-to-cart'
          type='primary'
          icon={<ShoppingCartOutlined />}
          loading={addToCartLoading}
          onClick={handleAddToCart}
          style={{ width: '100%' }}
        >
          Add to Cart
        </Button>,
      ]}
      bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      <Card.Meta
        title={
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.2em',
              height: '2.4em',
            }}
          >
            {product.title}
          </div>
        }
        description={
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.2em',
                height: '3.6em',
                marginBottom: '8px',
              }}
            >
              {product.description}
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                  ${product.price}
                </Text>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <StarOutlined
                    style={{ color: '#faad14', marginRight: '4px' }}
                  />
                  <Text type='secondary' style={{ fontSize: '12px' }}>
                    {product.rating?.rate || 0} ({product.rating?.count || 0})
                  </Text>
                </div>
              </div>
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '12px',
                  color: '#666',
                }}
              >
                {typeof product.category === 'string'
                  ? product.category
                  : product.category?.name || 'Uncategorized'}
              </div>
            </div>
          </div>
        }
      />
    </Card>
  );
};
