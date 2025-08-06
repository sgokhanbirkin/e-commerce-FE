'use client';

import React from 'react';
import { Form, Input, Button, Row, Col, Select } from 'antd';
import type { Address } from '@data-access/types';

const { Option } = Select;

interface AddressFormProps {
  initialValues?: Address | null;
  onSubmit: (values: Omit<Address, 'id'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const countries = [
    { code: 'TR', name: 'Türkiye' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'AT', name: 'Austria' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'PL', name: 'Poland' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'HU', name: 'Hungary' },
    { code: 'RO', name: 'Romania' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'HR', name: 'Croatia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LV', name: 'Latvia' },
    { code: 'EE', name: 'Estonia' },
    { code: 'IE', name: 'Ireland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'GR', name: 'Greece' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'MT', name: 'Malta' },
    { code: 'LU', name: 'Luxembourg' },
  ];

  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={initialValues || {}}
      onFinish={handleSubmit}
      autoComplete='off'
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name='label'
            label='Adres Etiketi'
            rules={[
              { required: true, message: 'Lütfen adres etiketi girin' },
              { max: 50, message: 'Etiket 50 karakterden uzun olamaz' },
            ]}
          >
            <Input placeholder='Örn: Ev, İş, Yazlık' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name='line1'
            label='Adres Satırı 1'
            rules={[
              { required: true, message: 'Lütfen adres girin' },
              { max: 100, message: 'Adres 100 karakterden uzun olamaz' },
            ]}
          >
            <Input placeholder='Sokak, cadde, bina no' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name='line2'
            label='Adres Satırı 2 (Opsiyonel)'
            rules={[{ max: 100, message: 'Adres 100 karakterden uzun olamaz' }]}
          >
            <Input placeholder='Apartman, daire, kat' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='city'
            label='Şehir'
            rules={[
              { required: true, message: 'Lütfen şehir girin' },
              { max: 50, message: 'Şehir 50 karakterden uzun olamaz' },
            ]}
          >
            <Input placeholder='Şehir' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='postal'
            label='Posta Kodu'
            rules={[
              { required: true, message: 'Lütfen posta kodu girin' },
              {
                pattern: /^\d{5}$/,
                message: 'Geçerli bir posta kodu girin (5 haneli)',
              },
            ]}
          >
            <Input placeholder='34000' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='country'
            label='Ülke'
            rules={[{ required: true, message: 'Lütfen ülke seçin' }]}
          >
            <Select placeholder='Ülke seçin'>
              {countries.map(country => (
                <Option key={country.code} value={country.name}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='phone'
            label='Telefon'
            rules={[
              { required: true, message: 'Lütfen telefon numarası girin' },
              {
                pattern: /^[+]?[\d\s\-\(\)]{10,}$/,
                message: 'Geçerli bir telefon numarası girin',
              },
            ]}
          >
            <Input placeholder='+90 555 123 4567' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={onCancel} style={{ marginRight: 8 }}>
              İptal
            </Button>
            <Button type='primary' htmlType='submit' loading={loading}>
              {initialValues ? 'Güncelle' : 'Ekle'}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AddressForm;
