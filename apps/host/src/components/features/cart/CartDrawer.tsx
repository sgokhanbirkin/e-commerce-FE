'use client';

import React from 'react';
import {
  Drawer,
  Typography,
  Space,
  List,
  Button,
  Popconfirm,
  Image,
  InputNumber,
  App,
} from 'antd';
import { useCartDrawer } from './CartDrawerContext';
import {
  useGetCartItemsQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from '@data-access/api';
import { DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Text, Title } = Typography;

export function CartDrawer() {
  const { isCartOpen, closeCart } = useCartDrawer();
  const {
    data: cartItems = [],
    isLoading,
    error,
    refetch,
  } = useGetCartItemsQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const { message } = App.useApp();

  const handleRemove = async (itemId: string) => {
    try {
      await removeFromCart(itemId).unwrap();
      message.success('Ürün sepetten kaldırıldı');
      refetch();
    } catch (err) {
      message.error('Ürün sepetten kaldırılamadı');
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    console.log('🔍 CartDrawer handleUpdateQuantity called with:', {
      itemId,
      quantity,
    });

    if (quantity <= 0) {
      await handleRemove(itemId);
      return;
    }
    try {
      console.log('🔍 CartDrawer calling updateCartItem mutation...');
      const result = await updateCartItem({ itemId, quantity }).unwrap();
      console.log('🔍 CartDrawer updateCartItem success:', result);
      message.success('Miktar güncellendi');
      refetch();
    } catch (err) {
      console.error('🔍 CartDrawer updateCartItem error:', err);
      console.error('🔍 CartDrawer Error details:', {
        status: (err as any)?.status,
        data: (err as any)?.data,
        message: (err as any)?.message,
      });
      message.error('Miktar güncellenemedi');
    }
  };

  return (
    <Drawer
      title='Sepet'
      placement='right'
      width={360}
      open={isCartOpen}
      onClose={closeCart}
      styles={{ body: { padding: 0, overflow: 'auto' } }}
    >
      <div style={{ padding: '16px' }}>
        <Space direction='vertical' style={{ width: '100%' }}>
          {error ? (
            <Text type='danger'>Sepet yüklenemedi</Text>
          ) : cartItems.length === 0 ? (
            <Text>Sepetiniz boş</Text>
          ) : (
            cartItems.map(item => {
              const productId = item.product?.id;
              const imageUrl =
                item.product?.imageUrl ||
                'https://via.placeholder.com/48x48?text=No+Image';
              const title = item.product?.title || 'Bilinmiyor';
              const variant = item.variant
                ? `${item.variant.name || ''} ${item.variant.value || ''}`
                : '';
              const price = item.variant?.price ?? item.product?.price;
              return (
                <div
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #eee',
                    padding: '8px 0',
                    display: 'flex',
                    gap: 8,
                  }}
                >
                  <Link
                    href={productId ? `/products/${productId}` : '#'}
                    style={{ display: 'block' }}
                  >
                    <Image
                      src={imageUrl}
                      alt={title}
                      width={48}
                      height={48}
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                      preview={false}
                    />
                  </Link>
                  <div style={{ flex: 1 }}>
                    <Link
                      href={productId ? `/products/${productId}` : '#'}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      <Text strong>{title}</Text>
                    </Link>
                    <br />
                    <Text type='secondary'>{variant}</Text>
                    <br />
                    <Space>
                      <Text>Miktar:</Text>
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
                    <br />
                    <Text>
                      Fiyat: {typeof price === 'number' ? `${price} ₺` : '-'}
                    </Text>
                  </div>
                  <Popconfirm
                    title='Ürünü sepetten kaldırmak istediğinize emin misiniz?'
                    onConfirm={() => handleRemove(item.id)}
                    okText='Evet'
                    cancelText='Vazgeç'
                  >
                    <Button type='text' danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              );
            })
          )}
        </Space>
      </div>
    </Drawer>
  );
}
