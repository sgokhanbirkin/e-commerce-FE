'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  Typography,
  Spin,
  Alert,
  Button,
  Radio,
  Space,
  Row,
  Col,
  Rate,
  Tabs,
  App,
} from 'antd';
import {
  useGetProductByIdQuery,
  useGetVariantsQuery,
  useAddToCartMutation,
} from '@data-access/api';
import { useCartDrawer } from '../../../components/features/cart/CartDrawerContext';
import { ProductReviews } from '../../../components/features/products/ProductReviews';

const { Title, Text, Paragraph } = Typography;

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id?.toString();
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId || '', { skip: !productId });
  const { data: variants = [], isLoading: variantsLoading } =
    useGetVariantsQuery(productId || '', { skip: !productId });
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    variants[0]?.id?.toString()
  );
  const [addToCart, { isLoading: addToCartLoading }] = useAddToCartMutation();
  const { openCart } = useCartDrawer();
  const { message } = App.useApp();

  React.useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0].id?.toString());
    }
  }, [variants, selectedVariant]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    try {
      await addToCart({
        variantId: Number(selectedVariant),
        quantity: 1,
      }).unwrap();
      message.success('Product added to cart!');
      openCart();
    } catch (err) {
      message.error('Failed to add product to cart');
      console.error('Add to cart error:', err);
    }
  };

  if (isLoading || variantsLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size='large' />
        <div style={{ marginTop: '16px' }}>
          <Text type='secondary'>Loading product...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message='Error Loading Product'
        description={typeof error === 'string' ? error : JSON.stringify(error)}
        type='error'
        showIcon
        style={{ marginBottom: '16px' }}
      />
    );
  }

  if (!product) {
    return <Text type='secondary'>Product not found.</Text>;
  }

  return (
    <div className='page-container' style={{ marginTop: 24, marginBottom: 24 }}>
      <Row gutter={[24, 24]}>
        {/* Sol: Ürün Görseli */}
        <Col xs={24} md={10}>
          <img
            src={product.imageUrl}
            alt={product.title}
            style={{ width: '100%', borderRadius: 8, objectFit: 'contain' }}
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x400?text=No+Image';
            }}
          />
        </Col>

        {/* Sağ: Ürün Bilgileri */}
        <Col xs={24} md={14}>
          <Title level={2} style={{ marginBottom: 16 }}>
            {product.title}
          </Title>
          <Text type='secondary' style={{ fontSize: 16, lineHeight: 1.6 }}>
            {product.description}
          </Text>

          {/* Rating */}
          <div
            style={{
              margin: '24px 0',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Rate
              allowHalf
              value={product.averageRating || product.rating?.rate || 0}
              disabled
            />
            <Text style={{ marginLeft: 12, fontSize: 14 }}>
              ({product.reviewCount || product.rating?.count || 0} reviews)
            </Text>
          </div>

          {/* Fiyat */}
          <Title level={3} style={{ color: '#1890ff', marginBottom: 24 }}>
            ${(product.price || 0).toFixed(2)}
          </Title>

          {/* Varyant Seçimi */}
          {variants.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <Text
                strong
                style={{ fontSize: 16, marginBottom: 8, display: 'block' }}
              >
                Choose Variant:
              </Text>
              <Radio.Group
                value={selectedVariant}
                onChange={e => setSelectedVariant(e.target.value)}
                optionType='button'
                buttonStyle='solid'
                style={{ marginTop: 8 }}
                size='large'
              >
                {variants.map(variant => (
                  <Radio.Button key={variant.id} value={variant.id?.toString()}>
                    {variant.name} {variant.value}{' '}
                    {variant.price ? `- $${variant.price}` : ''}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            type='primary'
            size='large'
            loading={addToCartLoading}
            disabled={!selectedVariant}
            onClick={handleAddToCart}
            style={{ width: '100%', height: 48, fontSize: 16, borderRadius: 6 }}
          >
            Add to Cart
          </Button>
        </Col>
      </Row>

      {/* Tabs: Description ve Reviews */}
      <Tabs
        defaultActiveKey='1'
        style={{ marginTop: 48 }}
        items={[
          {
            key: '1',
            label: 'Description',
            children: (
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                {product.description}
              </Paragraph>
            ),
          },
          {
            key: '2',
            label: `Reviews (${product.reviewCount || product.rating?.count || 0})`,
            children: (
              <ProductReviews
                productId={productId || ''}
                productReviews={product.reviews}
                productReviewCount={product.reviewCount}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
