import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import { ArrowRight, Check, ShieldCheck, ShoppingCart, Package, Layers, CreditCard, Star } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-ink flex flex-col justify-between selection:bg-accent-light selection:text-accent font-sans">
      {/* Top Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded bg-ink text-white flex items-center justify-center font-bold text-xs">
            M
          </div>
          <span className="font-semibold text-sm tracking-tight text-ink">Autonomous MERN Builder</span>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="bg-ink hover:bg-black text-white text-xs">
              Get Started
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-canvas-subtle border border-border text-xs text-ink-muted">
          <span>Automated MERN Code Generation</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-ink max-w-2xl mx-auto leading-tight">
          Ship full-stack e-commerce stores in seconds.
        </h1>

        <p className="text-sm sm:text-base text-ink-muted max-w-xl mx-auto leading-relaxed">
          Configure store basics, pick optional modules (Products, Razorpay Payments, Reviews), and generate a clean, custom-coded MERN repository zipped for download.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/login">
            <Button size="lg" className="bg-ink hover:bg-black text-white shadow-subtle text-xs px-5 py-2.5 font-medium">
              Start Building
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="text-xs px-5 py-2.5 font-medium">
              Explore Demo Store
            </Button>
          </Link>
        </div>

        {/* Core vs Optional Architecture Overview */}
        <div className="pt-14 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Core Features */}
          <div className="p-6 rounded-[8px] border border-border bg-canvas-soft space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Built-in Core Plumbing</h2>
              <Badge variant="success">Always Included</Badge>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Every generated store arrives with production-grade essentials pre-connected.
            </p>
            <ul className="space-y-2.5 text-xs text-ink-soft">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success shrink-0" />
                <span><strong>Authentication:</strong> Secure JWT user login, registration, and routes</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success shrink-0" />
                <span><strong>Shopping Cart:</strong> Quantity controls, persistent sessions, subtotals</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success shrink-0" />
                <span><strong>Order Management:</strong> Order placement, history, and status tracking</span>
              </li>
            </ul>
          </div>

          {/* Optional Modules */}
          <div className="p-6 rounded-[8px] border border-border bg-white space-y-4 shadow-subtle">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Optional Add-on Modules</h2>
              <Badge variant="neutral">User Configurable</Badge>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Toggle only what your custom commerce application requires.
            </p>
            <ul className="space-y-2.5 text-xs text-ink-soft">
              <li className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-accent shrink-0" />
                <span><strong>Products:</strong> Multi-category management, variants, and catalog views</span>
              </li>
              <li className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-accent shrink-0" />
                <span><strong>Razorpay Payments:</strong> Test mode checkout integration wired to orders</span>
              </li>
              <li className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-warning shrink-0" />
                <span><strong>Customer Reviews:</strong> Ratings & written reviews using core auth</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-6 text-center text-xs text-ink-muted">
        Autonomous MERN E-Commerce Code Generator • Notion-Inspired Developer Tooling
      </footer>
    </div>
  );
};

export default LandingPage;
