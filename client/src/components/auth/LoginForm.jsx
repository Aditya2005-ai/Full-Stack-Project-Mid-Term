import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';

export const LoginForm = ({ onSubmit, loading = false }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit || (() => {}))} className="space-y-4">
      <Input
        label="Work Email"
        type="email"
        placeholder="developer@company.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Authenticating...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
