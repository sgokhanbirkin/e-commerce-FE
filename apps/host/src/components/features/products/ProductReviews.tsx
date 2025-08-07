import React, { useState } from 'react';
import { List, Avatar, Form, Input, Button, Rate, Typography, App } from 'antd';
import { useGetReviewsQuery, useAddReviewMutation } from '@data-access/api';
import type { Review } from '@data-access/types';

const { TextArea } = Input;
const { Text } = Typography;

interface ProductReviewsProps {
  productId: string;
  productReviews?: Review[];
  productReviewCount?: number;
}

export function ProductReviews({
  productId,
  productReviews,
  productReviewCount,
}: ProductReviewsProps) {
  const {
    data: apiReviews = [],
    isLoading,
    error,
  } = useGetReviewsQuery(productId, {
    skip: !!productReviews, // Skip API call if we have product reviews
  });
  const [addReview, { isLoading: adding }] = useAddReviewMutation();
  const [form] = Form.useForm();
  const { message } = App.useApp();

  // Use product reviews if available, otherwise use API reviews
  const reviews = productReviews || apiReviews;
  const reviewCount = productReviewCount || reviews.length;

  const onFinish = async (values: any) => {
    try {
      await addReview({ productId, ...values }).unwrap();
      message.success('Review submitted!');
      form.resetFields();
    } catch {
      message.error('Failed to submit review.');
    }
  };

  return (
    <>
      <List
        loading={isLoading}
        dataSource={reviews}
        header={
          <Typography.Title level={4} style={{ marginBottom: 24 }}>
            {reviewCount} Reviews
          </Typography.Title>
        }
        itemLayout='vertical'
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>{item.user?.name?.charAt(0) || 'A'}</Avatar>}
              title={
                <div>
                  <Text strong>{item.user?.name || 'Anonymous'}</Text>
                  <Rate
                    disabled
                    defaultValue={item.rating}
                    style={{ marginLeft: 8 }}
                  />
                </div>
              }
              description={
                <div>
                  <Typography.Paragraph
                    style={{ marginTop: 12, fontSize: 16, lineHeight: 1.6 }}
                  >
                    {item.comment}
                  </Typography.Paragraph>
                  <Text type='secondary' style={{ fontSize: 12 }}>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : ''}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        style={{
          marginTop: 48,
          padding: 24,
          background: '#fafafa',
          borderRadius: 8,
        }}
      >
        <Typography.Title level={5} style={{ marginBottom: 24 }}>
          Add Your Review
        </Typography.Title>
        <Form.Item name='rating' label='Rating' rules={[{ required: true }]}>
          <Rate />
        </Form.Item>
        <Form.Item
          name='title'
          label='Title'
          rules={[
            {
              required: true,
              message: 'Please enter a title for your review.',
            },
          ]}
        >
          <Input placeholder='Review title' style={{ fontSize: 16 }} />
        </Form.Item>
        <Form.Item
          name='comment'
          label='Comment'
          rules={[{ required: true, message: 'Please write your review.' }]}
        >
          <TextArea rows={4} style={{ fontSize: 16 }} />
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={adding}
            style={{ height: 40, fontSize: 16, borderRadius: 6 }}
          >
            Submit Review
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
