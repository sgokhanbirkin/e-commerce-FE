'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Typography,
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Divider,
  Space,
  Alert,
  App,
  Steps,
  Radio,
  Checkbox,
} from 'antd';
import {
  ShoppingCartOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context';
import { useGetCartItemsQuery, useClearCartMutation } from '@data-access/api';
import { clearCartFromStorage } from '@data-access/cart-utils';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const { Step } = Steps;

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    postal: string;
    country: string;
  };
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
  acceptTerms: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { data: cartItems = [], isLoading } = useGetCartItemsQuery();
  const [clearCart] = useClearCartMutation();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }
  }, [isAuthenticated, router]);

  // Redirect if cart is empty
  React.useEffect(() => {
    if (!isLoading && (!cartItems || cartItems.length === 0)) {
      router.push('/');
      message.warning('Your cart is empty');
    }
  }, [cartItems, isLoading, router, message]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.variant?.price ?? item.product?.price ?? 0;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleNext = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (values: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      console.log('🛒 Starting order submission...');

      // Simulate order creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('🛒 Order simulation completed');

      // Clear the cart after successful order
      try {
        console.log('🛒 Attempting to clear cart via API...');
        await clearCart().unwrap();
        console.log('🛒 API cart clearing successful');
        clearCartFromStorage(); // Also clear from localStorage
        console.log('🛒 localStorage cart clearing completed');
        message.success('Order placed successfully! Cart cleared.');
      } catch (cartError) {
        console.log('🛒 Cart clearing failed, using localStorage fallback');
        console.log('🛒 Cart error details:', cartError);
        clearCartFromStorage(); // Clear from localStorage as fallback
        console.log('🛒 localStorage fallback cart clearing completed');
        message.success('Order placed successfully! Cart cleared.');
      }

      console.log('🛒 Redirecting to orders page...');
      router.push('/orders');
    } catch (error) {
      console.error('Order submission error:', error);
      message.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: 'Order Summary',
      icon: <ShoppingCartOutlined />,
    },
    {
      title: 'Shipping',
      icon: <EnvironmentOutlined />,
    },
    {
      title: 'Payment',
      icon: <CreditCardOutlined />,
    },
    {
      title: 'Confirm',
      icon: <CheckCircleOutlined />,
    },
  ];

  if (isLoading) {
    return null;
  }

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '32px' }}>
        Checkout
      </Title>

      <Row gutter={[24, 24]}>
        {/* Left: Checkout Form */}
        <Col xs={24} lg={16}>
          <Card>
            <Steps
              current={currentStep}
              items={steps}
              style={{ marginBottom: '32px' }}
            />

            <Form
              form={form}
              layout='vertical'
              onFinish={handleSubmit}
              initialValues={{
                firstName: user?.firstName || user?.name?.split(' ')[0] || '',
                lastName:
                  user?.lastName ||
                  user?.name?.split(' ').slice(1).join(' ') ||
                  '',
                email: user?.email || '',
                country: 'Turkey',
                paymentMethod: 'credit_card',
                acceptTerms: false,
              }}
            >
              {/* Step 1: Order Summary */}
              {currentStep === 0 && (
                <div>
                  <Title level={4}>Order Summary</Title>
                  <div style={{ marginBottom: '24px' }}>
                    {cartItems.map(item => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 0',
                          borderBottom: '1px solid #f0f0f0',
                        }}
                      >
                        <div>
                          <Text strong>{item.product?.title}</Text>
                          {item.variant && (
                            <Text
                              type='secondary'
                              style={{ marginLeft: '8px' }}
                            >
                              ({item.variant.name}: {item.variant.value})
                            </Text>
                          )}
                          <br />
                          <Text type='secondary'>Qty: {item.quantity}</Text>
                        </div>
                        <Text strong>
                          $
                          {(
                            (item.variant?.price ?? item.product?.price ?? 0) *
                            item.quantity
                          ).toFixed(2)}
                        </Text>
                      </div>
                    ))}
                  </div>
                  <Button type='primary' onClick={handleNext} block>
                    Continue to Shipping
                  </Button>
                </div>
              )}

              {/* Step 2: Shipping Information */}
              {currentStep === 1 && (
                <div>
                  <Title level={4}>Shipping Information</Title>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name='firstName'
                        label='First Name'
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your first name',
                          },
                        ]}
                      >
                        <Input prefix={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name='lastName'
                        label='Last Name'
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your last name',
                          },
                        ]}
                      >
                        <Input prefix={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name='email'
                        label='Email'
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your email',
                          },
                          {
                            type: 'email',
                            message: 'Please enter a valid email',
                          },
                        ]}
                      >
                        <Input prefix={<MailOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name='phone'
                        label='Phone'
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your phone number',
                          },
                        ]}
                      >
                        <Input prefix={<PhoneOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name={['address', 'line1']}
                    label='Address Line 1'
                    rules={[
                      { required: true, message: 'Please enter your address' },
                    ]}
                  >
                    <Input prefix={<EnvironmentOutlined />} />
                  </Form.Item>
                  <Form.Item
                    name={['address', 'line2']}
                    label='Address Line 2 (Optional)'
                  >
                    <Input />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        name={['address', 'city']}
                        label='City'
                        rules={[
                          { required: true, message: 'Please enter your city' },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        name={['address', 'postal']}
                        label='Postal Code'
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your postal code',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        name={['address', 'country']}
                        label='Country'
                        rules={[
                          {
                            required: true,
                            message: 'Please select your country',
                          },
                        ]}
                      >
                        <Select>
                          <Option value='Turkey'>Turkey</Option>
                          <Option value='USA'>USA</Option>
                          <Option value='UK'>UK</Option>
                          <Option value='Germany'>Germany</Option>
                          <Option value='France'>France</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Space>
                    <Button onClick={handlePrev}>Back</Button>
                    <Button type='primary' onClick={handleNext}>
                      Continue to Payment
                    </Button>
                  </Space>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 2 && (
                <div>
                  <Title level={4}>Payment Method</Title>
                  <Form.Item name='paymentMethod' label='Select Payment Method'>
                    <Radio.Group>
                      <Space direction='vertical'>
                        <Radio value='credit_card'>
                          <CreditCardOutlined /> Credit Card
                        </Radio>
                        <Radio value='paypal'>PayPal</Radio>
                        <Radio value='bank_transfer'>Bank Transfer</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) =>
                      getFieldValue('paymentMethod') === 'credit_card' && (
                        <div>
                          <Row gutter={16}>
                            <Col xs={24}>
                              <Form.Item
                                name='cardName'
                                label='Cardholder Name'
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please enter cardholder name',
                                  },
                                ]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={16}>
                            <Col xs={24}>
                              <Form.Item
                                name='cardNumber'
                                label='Card Number'
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please enter card number',
                                  },
                                ]}
                              >
                                <Input placeholder='1234 5678 9012 3456' />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={16}>
                            <Col xs={12}>
                              <Form.Item
                                name='cardExpiry'
                                label='Expiry Date'
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please enter expiry date',
                                  },
                                ]}
                              >
                                <Input placeholder='MM/YY' />
                              </Form.Item>
                            </Col>
                            <Col xs={12}>
                              <Form.Item
                                name='cardCvv'
                                label='CVV'
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please enter CVV',
                                  },
                                ]}
                              >
                                <Input placeholder='123' />
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                      )
                    }
                  </Form.Item>

                  <Space>
                    <Button onClick={handlePrev}>Back</Button>
                    <Button type='primary' onClick={handleNext}>
                      Review Order
                    </Button>
                  </Space>
                </div>
              )}

              {/* Step 4: Order Confirmation */}
              {currentStep === 3 && (
                <div>
                  <Title level={4}>Order Confirmation</Title>
                  <Alert
                    message='Please review your order details before placing the order'
                    type='info'
                    style={{ marginBottom: '24px' }}
                  />

                  <Form.Item
                    name='acceptTerms'
                    valuePropName='checked'
                    rules={[
                      {
                        validator: (_, value) =>
                          value
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error(
                                  'Please accept the terms and conditions'
                                )
                              ),
                      },
                    ]}
                  >
                    <Checkbox>
                      I agree to the{' '}
                      <a href='/terms' target='_blank'>
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href='/privacy' target='_blank'>
                        Privacy Policy
                      </a>
                    </Checkbox>
                  </Form.Item>

                  <Space>
                    <Button onClick={handlePrev}>Back</Button>
                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={isSubmitting}
                      size='large'
                    >
                      Place Order
                    </Button>
                  </Space>
                </div>
              )}
            </Form>
          </Card>
        </Col>

        {/* Right: Order Summary */}
        <Col xs={24} lg={8}>
          <Card
            title='Order Summary'
            style={{ position: 'sticky', top: '24px' }}
          >
            <div style={{ marginBottom: '16px' }}>
              {cartItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Text>{item.product?.title}</Text>
                    {item.variant && (
                      <Text
                        type='secondary'
                        style={{ display: 'block', fontSize: '12px' }}
                      >
                        {item.variant.name}: {item.variant.value}
                      </Text>
                    )}
                    <Text type='secondary' style={{ fontSize: '12px' }}>
                      Qty: {item.quantity}
                    </Text>
                  </div>
                  <Text strong>
                    $
                    {(
                      (item.variant?.price ?? item.product?.price ?? 0) *
                      item.quantity
                    ).toFixed(2)}
                  </Text>
                </div>
              ))}
            </div>

            <Divider />

            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <Text>Subtotal:</Text>
                <Text>${calculateSubtotal().toFixed(2)}</Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <Text>Shipping:</Text>
                <Text>
                  {calculateShipping() === 0
                    ? 'Free'
                    : `$${calculateShipping().toFixed(2)}`}
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <Text>Tax:</Text>
                <Text>${calculateTax().toFixed(2)}</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Total:</Text>
                <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                  ${calculateTotal().toFixed(2)}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
