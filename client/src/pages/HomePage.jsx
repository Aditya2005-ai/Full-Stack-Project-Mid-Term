import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { useBuilderStore } from '../store/builderStore.js';
import PageContainer from '../components/layout/PageContainer.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import {
  Plus,
  ArrowRight,
  ShieldCheck,
  ShoppingCart,
  Package,
  Layers,
  CreditCard,
  Star,
  ExternalLink,
  Copy,
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';

const INITIAL_BUILDS = [
  {
    id: 'bld-001',
    name: 'Bloom Boutique',
    store: { currency: 'INR', theme: '#2383E2' },
    modules: ['products', 'payments', 'reviews'],
    status: 'Ready',
    createdAt: '2 hours ago'
  },
  {
    id: 'bld-002',
    name: 'Artisan Coffee Roasters',
    store: { currency: 'INR', theme: '#37352F' },
    modules: ['products', 'payments'],
    status: 'Ready',
    createdAt: 'Yesterday'
  }
];

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { resetBuilder, setProject, setSelectedModules } = useBuilderStore();
  const [builds, setBuilds] = useState(INITIAL_BUILDS);

  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'Engineer';

  const handleNewStore = () => {
    resetBuilder();
    navigate('/build');
  };

  const handleOpenBuild = (build) => {
    setProject({
      name: build.name,
      currency: build.store.currency,
      theme: build.store.theme
    });
    setSelectedModules(build.modules);
    navigate('/build');
  };

  const handleDuplicateBuild = (build) => {
    const dup = {
      ...build,
      id: `bld-${Date.now().toString(36)}`,
      name: `${build.name} (Copy)`,
      createdAt: 'Just now'
    };
    setBuilds([dup, ...builds]);
  };

  const handleDeleteBuild = (id) => {
    setBuilds(builds.filter((b) => b.id !== id));
  };

  return (
    <PageContainer>
      {/* Calm Notion-style Welcome Header */}
      <div className="pt-2 pb-6 border-b border-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              {greetingTime()}, {userName}.
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Build your e-commerce application. Configure store basics, pick optional modules, and generate runnable MERN code.
            </p>
          </div>

          <Button
            size="md"
            onClick={handleNewStore}
            className="bg-ink hover:bg-black text-white shrink-0 shadow-subtle"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Store
          </Button>
        </div>
      </div>

      <div className="space-y-8 pt-2">
        {/* Section 1: Core Features Overview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                Core Features (Included Automatically)
              </h2>
              <p className="text-xs text-ink-soft mt-0.5">
                Every generated application is built with complete, pre-wired commerce plumbing.
              </p>
            </div>
            <Badge variant="success">Always Active</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-[6px] border border-border bg-canvas-soft flex items-start space-x-3">
              <div className="p-1.5 rounded bg-white border border-border text-ink shrink-0">
                <ShieldCheck className="w-4 h-4 text-success" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-ink">Authentication</h3>
                <p className="text-[11px] text-ink-muted mt-0.5 leading-snug">
                  JWT auth, register, login, protected routes, and user session management.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-[6px] border border-border bg-canvas-soft flex items-start space-x-3">
              <div className="p-1.5 rounded bg-white border border-border text-ink shrink-0">
                <ShoppingCart className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-ink">Shopping Cart</h3>
                <p className="text-[11px] text-ink-muted mt-0.5 leading-snug">
                  Quantity manipulation, subtotals, item removal, and persistent cart state.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-[6px] border border-border bg-canvas-soft flex items-start space-x-3">
              <div className="p-1.5 rounded bg-white border border-border text-ink shrink-0">
                <Package className="w-4 h-4 text-warning" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-ink">Orders & Checkout</h3>
                <p className="text-[11px] text-ink-muted mt-0.5 leading-snug">
                  Order model, order placement flow, order history list, and status tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Optional Modules Preview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                Optional Modules
              </h2>
              <p className="text-xs text-ink-soft mt-0.5">
                Enable only what your store requires.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-[6px] border border-border bg-white flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink flex items-center">
                    <Layers className="w-3.5 h-3.5 mr-1.5 text-accent" />
                    Products
                  </span>
                  <Badge variant="neutral">Optional</Badge>
                </div>
                <p className="text-[11px] text-ink-muted mt-1 leading-snug">
                  Custom category management, product catalog, search, and detail views.
                </p>
              </div>
              <div className="pt-2 border-t border-border-subtle flex items-center text-[11px] text-ink-soft">
                <span>Multi-category support</span>
              </div>
            </div>

            <div className="p-3.5 rounded-[6px] border border-border bg-white flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink flex items-center">
                    <CreditCard className="w-3.5 h-3.5 mr-1.5 text-accent" />
                    Payments (Razorpay)
                  </span>
                  <Badge variant="neutral">Optional</Badge>
                </div>
                <p className="text-[11px] text-ink-muted mt-1 leading-snug">
                  Razorpay test mode gateway integrated directly with cart and orders.
                </p>
              </div>
              <div className="pt-2 border-t border-border-subtle flex items-center text-[11px] text-ink-soft">
                <span>Test mode configured</span>
              </div>
            </div>

            <div className="p-3.5 rounded-[6px] border border-border bg-white flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink flex items-center">
                    <Star className="w-3.5 h-3.5 mr-1.5 text-warning" />
                    Reviews & Ratings
                  </span>
                  <Badge variant="neutral">Optional</Badge>
                </div>
                <p className="text-[11px] text-ink-muted mt-1 leading-snug">
                  Customer product reviews and 5-star ratings using core auth.
                </p>
              </div>
              <div className="pt-2 border-t border-border-subtle flex items-center text-[11px] text-ink-soft">
                <span>Auth protected</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Recent Builds */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Recent Builds
            </h2>
            <Link to="/builds" className="text-xs text-accent hover:underline flex items-center">
              View all
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="border border-border rounded-[6px] bg-white divide-y divide-border-subtle overflow-hidden">
            {builds.map((b) => (
              <div
                key={b.id}
                className="p-3.5 flex items-center justify-between hover:bg-canvas-soft transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: b.store.theme }}
                    />
                    <h3 className="text-xs font-semibold text-ink">{b.name}</h3>
                    <Badge variant="brand" className="text-[10px]">{b.store.currency}</Badge>
                    <Badge variant="success" className="text-[10px]">{b.status}</Badge>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-ink-muted">
                    <span>Modules: {b.modules.join(', ')}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {b.createdAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenBuild(b)}
                    className="text-xs text-ink-soft hover:text-ink"
                    title="Open in Builder"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    Open
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicateBuild(b)}
                    className="text-xs text-ink-soft hover:text-ink"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Duplicate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBuild(b.id)}
                    className="text-xs text-ink-muted hover:text-danger"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Quick Start Banner */}
        <div className="p-4 rounded-[6px] border border-border bg-canvas-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-semibold text-ink flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-accent mr-1.5" />
              Need to build an e-commerce store quickly?
            </h4>
            <p className="text-[11px] text-ink-muted">
              Launch the 5-step wizard to configure store basics, custom product categories, and Razorpay test payments.
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleNewStore}
            className="bg-ink hover:bg-black text-white shrink-0 text-xs"
          >
            Launch Builder Wizard
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
