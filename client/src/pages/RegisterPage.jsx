import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { ArrowRight, Check } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading, error: authError } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.name.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (!formData.email.includes('@')) {
      setLocalError('Please enter a valid work email.');
      return;
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    const res = await registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    if (res.success) {
      navigate('/home');
    } else {
      setLocalError(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-canvas-soft flex items-center justify-center p-6 selection:bg-accent-light selection:text-accent">
      <div className="max-w-md w-full bg-white rounded-lg border border-border shadow-card p-8">
        <div className="text-center mb-6">
          <div className="w-8 h-8 rounded bg-ink text-white flex items-center justify-center font-bold text-sm mx-auto mb-3">
            M
          </div>
          <h2 className="text-xl font-bold text-ink tracking-tight">Create your account</h2>
          <p className="text-xs text-ink-muted mt-1">
            Start configuring autonomous e-commerce applications
          </p>
        </div>

        {(localError || authError) && (
          <div className="mb-4 p-3 rounded bg-danger-light border border-danger-border text-xs text-danger">
            {localError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Ada Lovelace"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Work Email"
            type="email"
            placeholder="ada@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-ink hover:bg-black text-white h-9 text-xs font-medium"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>

          <div className="pt-3 text-center text-xs text-ink-muted border-t border-border-subtle">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
