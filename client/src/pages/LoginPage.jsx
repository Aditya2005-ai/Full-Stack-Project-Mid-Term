import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { Terminal, ArrowRight, ShieldCheck, Box, Check, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuthStore();

  const [email, setEmail] = useState('developer@demo.com');
  const [password, setPassword] = useState('Dev@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !email.includes('@')) {
      setLocalError('Please enter a valid work email address.');
      return;
    }
    if (!password || password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    const res = await login({ email, password });
    if (res.success) {
      navigate('/home');
    } else {
      setLocalError(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-canvas-soft flex items-center justify-center p-6 selection:bg-accent-light selection:text-accent">
      <div className="max-w-4xl w-full bg-white rounded-lg border border-border shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Brand & Overview (Notion Editorial Style) */}
        <div className="bg-canvas-subtle p-8 md:p-10 border-b md:border-b-0 md:border-r border-border flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-ink">
              <div className="w-7 h-7 rounded bg-ink text-white flex items-center justify-center font-bold text-xs">
                M
              </div>
              <span className="font-semibold text-sm tracking-tight text-ink">
                Autonomous MERN Builder
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-ink tracking-tight leading-snug">
                Configure once. Generate clean, runnable MERN code.
              </h1>
              <p className="text-xs text-ink-muted leading-relaxed">
                A visual engineering platform providing automated architecture synthesis, DAG dependency resolution, and downloadable full-stack repositories.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-start space-x-2 text-xs text-ink-soft">
                <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <span><strong>Core built-in:</strong> Auth, Shopping Cart, Orders</span>
              </div>
              <div className="flex items-start space-x-2 text-xs text-ink-soft">
                <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <span><strong>Configurable:</strong> Products, Razorpay Payments, Reviews</span>
              </div>
              <div className="flex items-start space-x-2 text-xs text-ink-soft">
                <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <span><strong>Export:</strong> Complete MERN project in ZIP with seed data</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border-subtle mt-8">
            <p className="text-[11px] text-ink-muted">
              Demo Test Account: <code className="text-ink font-mono bg-canvas-inset px-1 py-0.5 rounded">developer@demo.com</code> / <code className="text-ink font-mono bg-canvas-inset px-1 py-0.5 rounded">Dev@123</code>
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-ink tracking-tight">Sign in to your account</h2>
            <p className="text-xs text-ink-muted mt-1">
              Enter your credentials to access your store builder workspace
            </p>
          </div>

          {(localError || authError) && (
            <div className="mb-4 p-3 rounded bg-danger-light border border-danger-border text-xs text-danger">
              {localError || authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs text-ink-muted">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                <span>Remember me</span>
              </label>
              <Link to="/register" className="text-accent hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-ink hover:bg-black text-white h-9 text-xs font-medium"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>

            <div className="pt-3 text-center text-xs text-ink-muted border-t border-border-subtle">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent font-medium hover:underline">
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
