'use client';

import { Button, Result } from 'antd';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Result
      status='500'
      title='Something went wrong!'
      subTitle='Sorry, an error occurred while loading this page.'
      extra={[
        <Button type='primary' key='reset' onClick={reset}>
          Try again
        </Button>,
      ]}
    />
  );
}
