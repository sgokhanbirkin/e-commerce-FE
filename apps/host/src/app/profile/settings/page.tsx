'use client';

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Divider,
  Typography,
  Space,
  Switch,
  message,
  Alert,
  Avatar,
  Upload,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  SecurityScanOutlined,
  UploadOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;
const { Password } = Input;

const ProfileSettingsPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  // Loading durumunda hiçbir şey gösterme
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleProfileUpdate = async (values: any) => {
    setLoading(true);
    try {
      // API call would go here
      console.log('Profile update:', values);
      message.success('Profil bilgileri güncellendi');
    } catch (error) {
      message.error('Güncelleme başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    setLoading(true);
    try {
      // API call would go here
      console.log('Password change:', values);
      message.success('Şifre başarıyla değiştirildi');
      passwordForm.resetFields();
    } catch (error) {
      message.error('Şifre değiştirme başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (type: string, checked: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [type]: checked,
    }));
    message.success(
      `${type === 'email' ? 'E-posta' : type === 'sms' ? 'SMS' : 'Push'} bildirimleri ${checked ? 'açıldı' : 'kapatıldı'}`
    );
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '32px' }}>
        Hesap Ayarları
      </Title>

      <Row gutter={[24, 24]}>
        {/* Profil Bilgileri */}
        <Col xs={24} lg={12}>
          <Card title='Profil Bilgileri' icon={<UserOutlined />}>
            <Form
              form={form}
              layout='vertical'
              initialValues={{
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
              }}
              onFinish={handleProfileUpdate}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Avatar size={100} icon={<UserOutlined />} />
                    <div style={{ marginTop: '16px' }}>
                      <Upload
                        name='avatar'
                        listType='picture-circle'
                        showUploadList={false}
                        beforeUpload={() => false}
                      >
                        <Button icon={<UploadOutlined />}>
                          Fotoğraf Değiştir
                        </Button>
                      </Upload>
                    </div>
                  </div>
                </Col>
              </Row>

              <Form.Item
                label='Ad Soyad'
                name='name'
                rules={[{ required: true, message: 'Ad soyad gerekli!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder='Ad Soyad' />
              </Form.Item>

              <Form.Item
                label='E-posta'
                name='email'
                rules={[
                  { required: true, message: 'E-posta gerekli!' },
                  { type: 'email', message: 'Geçerli bir e-posta girin!' },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder='E-posta' />
              </Form.Item>

              <Form.Item label='Telefon' name='phone'>
                <Input placeholder='Telefon numarası' />
              </Form.Item>

              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={loading}
                  icon={<SaveOutlined />}
                  block
                >
                  Değişiklikleri Kaydet
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Şifre Değiştirme */}
        <Col xs={24} lg={12}>
          <Card title='Şifre Değiştir' icon={<LockOutlined />}>
            <Form
              form={passwordForm}
              layout='vertical'
              onFinish={handlePasswordChange}
            >
              <Form.Item
                label='Mevcut Şifre'
                name='currentPassword'
                rules={[{ required: true, message: 'Mevcut şifre gerekli!' }]}
              >
                <Password
                  prefix={<LockOutlined />}
                  placeholder='Mevcut şifre'
                />
              </Form.Item>

              <Form.Item
                label='Yeni Şifre'
                name='newPassword'
                rules={[
                  { required: true, message: 'Yeni şifre gerekli!' },
                  { min: 6, message: 'Şifre en az 6 karakter olmalı!' },
                ]}
              >
                <Password prefix={<LockOutlined />} placeholder='Yeni şifre' />
              </Form.Item>

              <Form.Item
                label='Yeni Şifre (Tekrar)'
                name='confirmPassword'
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Şifre tekrarı gerekli!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Şifreler eşleşmiyor!'));
                    },
                  }),
                ]}
              >
                <Password
                  prefix={<LockOutlined />}
                  placeholder='Yeni şifre tekrar'
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={loading}
                  icon={<LockOutlined />}
                  block
                >
                  Şifreyi Değiştir
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Bildirim Ayarları */}
      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title='Bildirim Ayarları' icon={<BellOutlined />}>
            <Space direction='vertical' style={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <Text strong>E-posta Bildirimleri</Text>
                  <br />
                  <Text type='secondary'>
                    Sipariş durumu ve kampanyalar için e-posta al
                  </Text>
                </div>
                <Switch
                  checked={notifications.email}
                  onChange={checked =>
                    handleNotificationChange('email', checked)
                  }
                />
              </div>

              <Divider />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <Text strong>SMS Bildirimleri</Text>
                  <br />
                  <Text type='secondary'>Önemli güncellemeler için SMS al</Text>
                </div>
                <Switch
                  checked={notifications.sms}
                  onChange={checked => handleNotificationChange('sms', checked)}
                />
              </div>

              <Divider />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <Text strong>Push Bildirimleri</Text>
                  <br />
                  <Text type='secondary'>Tarayıcı push bildirimleri al</Text>
                </div>
                <Switch
                  checked={notifications.push}
                  onChange={checked =>
                    handleNotificationChange('push', checked)
                  }
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Güvenlik Ayarları */}
      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title='Güvenlik Ayarları' icon={<SecurityScanOutlined />}>
            <Alert
              message='İki Faktörlü Kimlik Doğrulama'
              description='Hesabınızı daha güvenli hale getirmek için iki faktörlü kimlik doğrulamayı etkinleştirin.'
              type='info'
              showIcon
              style={{ marginBottom: '16px' }}
            />

            <Space direction='vertical' style={{ width: '100%' }}>
              <Button type='default' block>
                İki Faktörlü Kimlik Doğrulamayı Etkinleştir
              </Button>

              <Button type='default' block>
                Oturum Geçmişini Görüntüle
              </Button>

              <Button type='default' block>
                Bağlı Cihazları Yönet
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Hesap Silme */}
      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title='Tehlikeli Bölge'>
            <Alert
              message='Hesap Silme'
              description='Hesabınızı kalıcı olarak silmek istiyorsanız, bu işlem geri alınamaz.'
              type='warning'
              showIcon
              style={{ marginBottom: '16px' }}
            />

            <Button type='primary' danger block>
              Hesabımı Sil
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileSettingsPage;
