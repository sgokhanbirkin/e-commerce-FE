'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const success = await login(email, password);

      if (success) {
        onSuccess?.();
      } else {
        setError('Invalid email or password');
        onError?.('Invalid email or password');
      }
    } catch (err) {
      const errorMessage = 'Login failed. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h2>Login</h2>

      {error && (
        <div
          style={{
            color: '#f5222d',
            backgroundColor: '#fff2f0',
            border: '1px solid #ffccc7',
            padding: '0.5rem',
            marginBottom: '1rem',
            borderRadius: '4px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor='email'
            style={{ display: 'block', marginBottom: '0.5rem' }}
          >
            Email:
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
            }}
            disabled={isLoading}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor='password'
            style={{ display: 'block', marginBottom: '0.5rem' }}
          >
            Password:
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
            }}
            disabled={isLoading}
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};
