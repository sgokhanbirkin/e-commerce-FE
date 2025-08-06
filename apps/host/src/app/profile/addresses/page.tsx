'use client';

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Empty,
  Modal,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from '@data-access/api';
import AddressForm from '../../../components/features/checkout/AddressForm';
import type { Address } from '@data-access/types';

const { Title, Text } = Typography;

const AddressesPage: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { data: addresses, isLoading, refetch } = useGetAddressesQuery();
  const [addAddress, { isLoading: addingAddress }] = useAddAddressMutation();
  const [updateAddress, { isLoading: updatingAddress }] =
    useUpdateAddressMutation();
  const [deleteAddress, { isLoading: deletingAddress }] =
    useDeleteAddressMutation();

  if (authLoading) {
    return null;
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleAddAddress = async (addressData: Omit<Address, 'id'>) => {
    try {
      await addAddress(addressData).unwrap();
      message.success('Adres başarıyla eklendi');
      setIsModalVisible(false);
      refetch();
    } catch (error) {
      message.error('Adres eklenirken bir hata oluştu');
    }
  };

  const handleEditAddress = async (addressData: Address) => {
    try {
      await updateAddress(addressData).unwrap();
      message.success('Adres başarıyla güncellendi');
      setIsModalVisible(false);
      setEditingAddress(null);
      refetch();
    } catch (error) {
      message.error('Adres güncellenirken bir hata oluştu');
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await deleteAddress(addressId).unwrap();
      message.success('Adres başarıyla silindi');
      refetch();
    } catch (error) {
      message.error('Adres silinirken bir hata oluştu');
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setIsModalVisible(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingAddress(null);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Adreslerim
        </Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={openAddModal}>
          Yeni Adres Ekle
        </Button>
      </div>

      {addresses && addresses.length > 0 ? (
        <Row gutter={[16, 16]}>
          {addresses.map(address => (
            <Col xs={24} sm={12} lg={8} key={address.id}>
              <Card
                actions={[
                  <Button
                    key='edit'
                    type='text'
                    icon={<EditOutlined />}
                    onClick={() => openEditModal(address)}
                  >
                    Düzenle
                  </Button>,
                  <Popconfirm
                    key='delete'
                    title='Adresi silmek istediğinizden emin misiniz?'
                    onConfirm={() =>
                      address.id && handleDeleteAddress(address.id)
                    }
                    okText='Evet'
                    cancelText='Hayır'
                  >
                    <Button
                      type='text'
                      danger
                      icon={<DeleteOutlined />}
                      loading={deletingAddress}
                    >
                      Sil
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <EnvironmentOutlined
                    style={{
                      marginRight: '8px',
                      marginTop: '4px',
                      color: '#1890ff',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <Text strong>{address.label || 'Adres'}</Text>
                    <br />
                    <Text type='secondary'>
                      {address.line1}
                      {address.line2 && (
                        <>
                          <br />
                          {address.line2}
                        </>
                      )}
                      <br />
                      {address.city}, {address.postal}
                      <br />
                      {address.country}
                      {address.phone && (
                        <>
                          <br />
                          Tel: {address.phone}
                        </>
                      )}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description='Henüz adres eklenmemiş'
          >
            <Button type='primary' onClick={openAddModal}>
              İlk Adresinizi Ekleyin
            </Button>
          </Empty>
        </Card>
      )}

      <Modal
        title={editingAddress ? 'Adres Düzenle' : 'Yeni Adres Ekle'}
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={600}
      >
        <AddressForm
          initialValues={editingAddress}
          onSubmit={editingAddress ? handleEditAddress : handleAddAddress}
          onCancel={closeModal}
          loading={addingAddress || updatingAddress}
        />
      </Modal>
    </div>
  );
};

export default AddressesPage;
