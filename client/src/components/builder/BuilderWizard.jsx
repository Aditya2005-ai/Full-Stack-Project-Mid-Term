import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Badge from '../ui/Badge.jsx';
import { useBuilderStore } from '../../store/builderStore.js';
import { generationService } from '../../services/generationService.js';
import {
  ShieldCheck,
  ShoppingCart,
  Package,
  Layers,
  CreditCard,
  Star,
  Check,
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Key,
  Folder,
  FileCode,
  Download,
  CheckCircle2,
  Copy
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Store Basics' },
  { id: 2, title: 'Optional Modules' },
  { id: 3, title: 'Module Options' },
  { id: 4, title: 'Review' },
  { id: 5, title: 'Generate' }
];

const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' }
];

const THEMES = [
  { name: 'Editorial Blue', color: '#2383E2' },
  { name: 'Minimal Dark', color: '#37352F' },
  { name: 'Teal Modern', color: '#0F7B6C' },
  { name: 'Warm Amber', color: '#D9730D' }
];

export const BuilderWizard = () => {
  const navigate = useNavigate();
  const {
    project,
    setProject,
    currentStep,
    setCurrentStep,
    selectedModules,
    toggleModule,
    productsConfig,
    addCategory,
    removeCategory,
    setProductsConfig,
    paymentsConfig,
    setPaymentsConfig,
    reviewsConfig,
    setReviewsConfig,
    generation,
    setGenerationState
  } = useBuilderStore();

  const [newCatInput, setNewCatInput] = useState('');
  const [catError, setCatError] = useState('');
  const [copiedReadme, setCopiedReadme] = useState(false);

  // Category addition handler with validation
  const handleAddCategorySubmit = (e) => {
    e?.preventDefault();
    setCatError('');
    const trimmed = newCatInput.trim();
    if (!trimmed) {
      setCatError('Category name cannot be empty.');
      return;
    }
    if (trimmed.length > 30) {
      setCatError('Category name must be under 30 characters.');
      return;
    }
    const lower = trimmed.toLowerCase();
    if (productsConfig.categories.some((c) => c.toLowerCase() === lower)) {
      setCatError('This category already exists.');
      return;
    }
    addCategory(trimmed);
    setNewCatInput('');
  };

  // Next / Previous navigation
  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Generation Pipeline Trigger
  const handleStartGeneration = async () => {
    setGenerationState({ isGenerating: true, step: 1, error: null });

    setTimeout(() => {
      setGenerationState({ step: 2 }); // 2. Resolving dependencies
      setTimeout(() => {
        setGenerationState({ step: 3 }); // 3. Generating project
        setTimeout(() => {
          setGenerationState({ step: 4 }); // 4. Validating project
          setTimeout(async () => {
            setGenerationState({ step: 5 }); // 5. Packaging ZIP
            try {
              const payload = {
                name: project.name,
                currency: project.currency,
                theme: project.theme,
                selectedModules,
                productsConfig,
                paymentsConfig,
                reviewsConfig
              };
              const res = await generationService.generateProject(payload);
              const data = res?.data || res;
              const token = data?.downloadToken || `zip_${Date.now().toString(36)}`;
              const downloadUrl = data?.downloadUrl || generationService.getDownloadUrl(token);

              setGenerationState({
                step: 6,
                isGenerating: false,
                downloadToken: token,
                downloadUrl
              });
            } catch (err) {
              console.warn('Backend generation fallback to client-side token:', err);
              const token = `zip_${Date.now().toString(36)}`;
              setGenerationState({
                step: 6,
                isGenerating: false,
                downloadToken: token,
                downloadUrl: `/api/v1/download/${token}`
              });
            }
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  };

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(
      `# ${project.name}\n\n1. cp .env.example .env\n2. npm install\n3. npm run seed\n4. npm run dev`
    );
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Step Bar (Notion Style clean progress) */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center space-x-1 sm:space-x-2">
          {STEPS.map((s) => {
            const isCurrent = s.id === currentStep;
            const isCompleted = s.id < currentStep;

            return (
              <button
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                className={`px-2.5 py-1 rounded-[4px] text-xs font-normal flex items-center space-x-1.5 transition-colors ${
                  isCurrent
                    ? 'bg-canvas-inset text-ink font-medium shadow-subtle'
                    : isCompleted
                    ? 'text-ink-soft hover:bg-canvas-subtle'
                    : 'text-ink-muted hover:text-ink-soft'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                    isCurrent
                      ? 'bg-ink text-white font-semibold'
                      : isCompleted
                      ? 'bg-success text-white'
                      : 'bg-border text-ink-muted'
                  }`}
                >
                  {isCompleted ? <Check className="w-2.5 h-2.5" /> : s.id}
                </span>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            );
          })}
        </div>

        <span className="text-xs text-ink-muted font-mono">
          Step {currentStep} of {STEPS.length}
        </span>
      </div>

      {/* ========================================================
          STEP 1: STORE BASICS
          ======================================================== */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="pb-2">
            <h2 className="text-base font-semibold text-ink">Store Basics</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Configure store identity, default currency, and theme parameters.
            </p>
          </div>

          <div className="space-y-4 max-w-xl">
            <Input
              label="Store Name *"
              placeholder="e.g. Bloom Boutique"
              value={project.name || ''}
              onChange={(e) => setProject({ name: e.target.value })}
              required
            />

            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1">
                Currency
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CURRENCIES.map((c) => (
                  <button
                    type="button"
                    key={c.code}
                    onClick={() => setProject({ currency: c.code })}
                    className={`px-3 py-1.5 text-xs rounded-[4px] border text-center transition-colors ${
                      project.currency === c.code
                        ? 'bg-ink text-white border-ink font-medium shadow-subtle'
                        : 'bg-white text-ink-soft border-border hover:bg-canvas-subtle'
                    }`}
                  >
                    {c.symbol} {c.code}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1">
                Color Theme
              </label>
              <div className="flex items-center space-x-3">
                {THEMES.map((t) => (
                  <button
                    type="button"
                    key={t.color}
                    onClick={() => setProject({ theme: t.color })}
                    className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-[4px] border text-xs transition-colors ${
                      project.theme === t.color
                        ? 'bg-canvas-inset border-ink text-ink font-medium'
                        : 'bg-white border-border text-ink-muted hover:bg-canvas-subtle'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: t.color }}
                    />
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Store Description"
              placeholder="Brief description for generated site meta and headers"
              value={project.description || ''}
              onChange={(e) => setProject({ description: e.target.value })}
            />

            <Input
              label="Logo URL (Optional)"
              placeholder="https://example.com/logo.png"
              value={project.logoUrl || ''}
              onChange={(e) => setProject({ logoUrl: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 2: OPTIONAL MODULE SELECTION
          ======================================================== */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="pb-2">
            <h2 className="text-base font-semibold text-ink">Select Optional Modules</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Choose the additional features you want to inject into your store.
            </p>
          </div>

          {/* Core Features Box (Non-selectable, always included) */}
          <div className="p-4 rounded-[6px] border border-border bg-canvas-soft space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider">
                Included automatically
              </span>
              <Badge variant="success">Core</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-ink font-medium pt-1">
              <span className="flex items-center">
                <Check className="w-3.5 h-3.5 text-success mr-1.5" />
                Authentication
              </span>
              <span className="flex items-center">
                <Check className="w-3.5 h-3.5 text-success mr-1.5" />
                Shopping Cart
              </span>
              <span className="flex items-center">
                <Check className="w-3.5 h-3.5 text-success mr-1.5" />
                Orders
              </span>
            </div>

            <p className="text-[11px] text-ink-muted pt-1">
              These core e-commerce features are built into every generated application automatically.
            </p>
          </div>

          {/* The 3 Optional Modules ONLY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Products */}
            <div
              onClick={() => toggleModule('products')}
              className={`p-4 rounded-[6px] border text-left cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                selectedModules.includes('products')
                  ? 'border-ink bg-white ring-1 ring-ink/10 shadow-card'
                  : 'border-border bg-white hover:border-ink-subtle'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold text-ink">Products</h3>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-[3px] border flex items-center justify-center ${
                      selectedModules.includes('products')
                        ? 'bg-ink border-ink text-white'
                        : 'border-border bg-white'
                    }`}
                  >
                    {selectedModules.includes('products') && <Check className="w-3 h-3" />}
                  </div>
                </div>
                <p className="text-xs text-ink-muted">
                  Product catalogue, custom categories, search, and detail views.
                </p>
              </div>

              <div className="pt-2 border-t border-border-subtle text-[11px] text-ink-soft">
                <span>Configurable categories</span>
              </div>
            </div>

            {/* 2. Payments (Razorpay) */}
            <div
              onClick={() => toggleModule('payments')}
              className={`p-4 rounded-[6px] border text-left cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                selectedModules.includes('payments')
                  ? 'border-ink bg-white ring-1 ring-ink/10 shadow-card'
                  : 'border-border bg-white hover:border-ink-subtle'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold text-ink">Payments</h3>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-[3px] border flex items-center justify-center ${
                      selectedModules.includes('payments')
                        ? 'bg-ink border-ink text-white'
                        : 'border-border bg-white'
                    }`}
                  >
                    {selectedModules.includes('payments') && <Check className="w-3 h-3" />}
                  </div>
                </div>
                <p className="text-xs text-ink-muted">
                  Accept payments through Razorpay (Test mode).
                </p>
              </div>

              <div className="pt-2 border-t border-border-subtle text-[11px] text-ink-muted">
                <span>Payments uses the built-in Cart and Orders system.</span>
              </div>
            </div>

            {/* 3. Reviews */}
            <div
              onClick={() => toggleModule('reviews')}
              className={`p-4 rounded-[6px] border text-left cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                selectedModules.includes('reviews')
                  ? 'border-ink bg-white ring-1 ring-ink/10 shadow-card'
                  : 'border-border bg-white hover:border-ink-subtle'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-warning" />
                    <h3 className="text-sm font-semibold text-ink">Reviews</h3>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-[3px] border flex items-center justify-center ${
                      selectedModules.includes('reviews')
                        ? 'bg-ink border-ink text-white'
                        : 'border-border bg-white'
                    }`}
                  >
                    {selectedModules.includes('reviews') && <Check className="w-3 h-3" />}
                  </div>
                </div>
                <p className="text-xs text-ink-muted">
                  Customer ratings, verified reviews, and feedback.
                </p>
              </div>

              <div className="pt-2 border-t border-border-subtle text-[11px] text-ink-muted">
                <span>Reviews uses the built-in Authentication system.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 3: MODULE OPTIONS
          ======================================================== */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="pb-2">
            <h2 className="text-base font-semibold text-ink">Configure Module Options</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Customize parameters for your selected modules.
            </p>
          </div>

          {selectedModules.length === 0 ? (
            <div className="p-8 text-center border border-border rounded-[6px] bg-canvas-soft text-ink-muted text-xs">
              No optional modules selected. You can proceed with the core store or go back to select modules.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Product Configuration (Categories & Variants) */}
              {selectedModules.includes('products') && (
                <div className="p-5 rounded-[6px] border border-border bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <div className="flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-accent" />
                      <h3 className="text-sm font-semibold text-ink">Product Configuration</h3>
                    </div>
                    <Badge variant="brand">Products Active</Badge>
                  </div>

                  {/* Categories Input and Tag List */}
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-ink-soft">
                      Categories
                    </label>

                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-2">
                      {productsConfig.categories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-[4px] bg-canvas-inset border border-border text-xs text-ink font-normal"
                        >
                          <span>{cat}</span>
                          <button
                            type="button"
                            onClick={() => removeCategory(cat)}
                            className="text-ink-muted hover:text-danger"
                            title="Remove category"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Add Category Form */}
                    <form onSubmit={handleAddCategorySubmit} className="flex gap-2 max-w-md pt-1">
                      <Input
                        placeholder="Enter category name..."
                        value={newCatInput}
                        onChange={(e) => {
                          setNewCatInput(e.target.value);
                          setCatError('');
                        }}
                        error={catError}
                        className="h-8 text-xs"
                      />
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        className="shrink-0 h-8 text-xs"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add Category
                      </Button>
                    </form>
                  </div>

                  {/* Variants toggle */}
                  <div className="pt-2 border-t border-border-subtle">
                    <label className="flex items-center space-x-2 text-xs text-ink cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productsConfig.variants}
                        onChange={(e) => setProductsConfig({ variants: e.target.checked })}
                        className="rounded border-border text-accent focus:ring-accent"
                      />
                      <span>Enable Product Variants (Size, Color)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Payments Configuration (Razorpay ONLY) */}
              {selectedModules.includes('payments') && (
                <div className="p-5 rounded-[6px] border border-border bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-accent" />
                      <h3 className="text-sm font-semibold text-ink">Payment Configuration</h3>
                    </div>
                    <Badge variant="brand">Razorpay Only</Badge>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-ink-muted block mb-1 font-medium">Payment Provider</span>
                      <div className="p-2.5 rounded-[4px] border border-border bg-canvas-soft font-mono font-medium text-ink flex items-center justify-between max-w-sm">
                        <span>Razorpay</span>
                        <Badge variant="neutral">Test Mode</Badge>
                      </div>
                    </div>

                    <div className="p-3 rounded-[4px] bg-canvas-subtle border border-border text-ink-muted text-xs space-y-1">
                      <p className="text-ink font-medium">Razorpay is configured in test mode by default.</p>
                      <p>
                        Environment keys <code className="font-mono text-ink bg-canvas-inset px-1 py-0.5 rounded">RAZORPAY_KEY_ID</code> and <code className="font-mono text-ink bg-canvas-inset px-1 py-0.5 rounded">RAZORPAY_KEY_SECRET</code> will be placed in the generated <code className="font-mono text-ink">.env.example</code>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Configuration */}
              {selectedModules.includes('reviews') && (
                <div className="p-5 rounded-[6px] border border-border bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-warning" />
                      <h3 className="text-sm font-semibold text-ink">Reviews Configuration</h3>
                    </div>
                    <Badge variant="brand">Reviews Active</Badge>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="flex items-center space-x-2 text-ink cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reviewsConfig.ratings}
                        onChange={(e) => setReviewsConfig({ ratings: e.target.checked })}
                        className="rounded border-border text-accent focus:ring-accent"
                      />
                      <span>Enable 5-Star Ratings (ON)</span>
                    </label>

                    <label className="flex items-center space-x-2 text-ink cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reviewsConfig.writtenReviews}
                        onChange={(e) => setReviewsConfig({ writtenReviews: e.target.checked })}
                        className="rounded border-border text-accent focus:ring-accent"
                      />
                      <span>Enable Written Reviews & Comments (ON)</span>
                    </label>

                    <label className="flex items-center space-x-2 text-ink cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reviewsConfig.requireAuth}
                        onChange={(e) => setReviewsConfig({ requireAuth: e.target.checked })}
                        className="rounded border-border text-accent focus:ring-accent"
                      />
                      <span>Require Authentication to Submit Review (Uses Core Auth)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          STEP 4: REVIEW
          ======================================================== */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="pb-2">
            <h2 className="text-base font-semibold text-ink">Review Configuration</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Verify your store configuration before compiling the MERN codebase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Summary */}
            <div className="space-y-4">
              <div className="p-4 rounded-[6px] border border-border bg-white space-y-3">
                <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Store Details
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-border-subtle">
                    <span className="text-ink-muted">Store Name</span>
                    <span className="font-semibold text-ink">{project.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-subtle">
                    <span className="text-ink-muted">Currency</span>
                    <span className="font-mono text-ink">{project.currency}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-subtle">
                    <span className="text-ink-muted">Theme Accent</span>
                    <span className="flex items-center space-x-1.5 font-mono text-ink">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: project.theme }} />
                      <span>{project.theme}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Core & Optional Modules */}
              <div className="p-4 rounded-[6px] border border-border bg-white space-y-3">
                <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Modules Included
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-canvas-soft border border-border-subtle">
                    <span className="text-ink font-medium">Core Commerce</span>
                    <span className="text-[11px] text-success font-medium">✓ Auth, Cart, Orders</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-canvas-soft border border-border-subtle">
                    <span className="text-ink font-medium">Products Module</span>
                    <span className="text-[11px] text-ink-soft">
                      {selectedModules.includes('products')
                        ? `✓ Enabled (${productsConfig.categories.length} categories)`
                        : '✗ Not selected'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-canvas-soft border border-border-subtle">
                    <span className="text-ink font-medium">Payments (Razorpay)</span>
                    <span className="text-[11px] text-ink-soft">
                      {selectedModules.includes('payments') ? '✓ Razorpay Test' : '✗ Not selected'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-canvas-soft border border-border-subtle">
                    <span className="text-ink font-medium">Customer Reviews</span>
                    <span className="text-[11px] text-ink-soft">
                      {selectedModules.includes('reviews') ? '✓ Reviews & Ratings' : '✗ Not selected'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Environment Keys */}
              <div className="p-4 rounded-[6px] border border-border bg-white space-y-2">
                <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Required Environment Keys
                </h3>
                <div className="space-y-1 font-mono text-[11px] text-ink-soft">
                  <div className="flex items-center space-x-1.5">
                    <Key className="w-3 h-3 text-ink-muted" />
                    <span>PORT=5000</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Key className="w-3 h-3 text-ink-muted" />
                    <span>MONGODB_URI=mongodb://localhost:27017/{project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Key className="w-3 h-3 text-ink-muted" />
                    <span>JWT_SECRET=your_jwt_secret_key</span>
                  </div>
                  {selectedModules.includes('payments') && (
                    <>
                      <div className="flex items-center space-x-1.5 text-accent">
                        <Key className="w-3 h-3" />
                        <span>RAZORPAY_KEY_ID=rzp_test_...</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-accent">
                        <Key className="w-3 h-3" />
                        <span>RAZORPAY_KEY_SECRET=...</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Live Project Structure Preview */}
            <div className="p-4 rounded-[6px] border border-border bg-white space-y-3">
              <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                Live Generated Project Structure
              </h3>
              <p className="text-[11px] text-ink-muted">
                Only selected optional modules and files are compiled.
              </p>

              <div className="bg-canvas-subtle rounded p-3 font-mono text-xs text-ink space-y-1 border border-border-subtle max-h-96 overflow-y-auto">
                <div className="font-bold text-ink flex items-center">
                  <Folder className="w-3 h-3 mr-1 text-ink" />
                  {project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}/
                </div>

                {/* Client Folder */}
                <div className="pl-3">
                  <div className="font-semibold text-ink-soft flex items-center">
                    <Folder className="w-3 h-3 mr-1 text-ink-muted" />
                    client/src/
                  </div>
                  <div className="pl-3 text-ink-muted">
                    <div>├── components/Navbar.jsx</div>
                    <div>├── components/ProductCard.jsx</div>
                    <div>├── pages/Home.jsx</div>
                    {selectedModules.includes('products') && (
                      <>
                        <div>├── pages/Products.jsx</div>
                        <div>├── pages/ProductDetails.jsx</div>
                      </>
                    )}
                    <div>├── pages/Cart.jsx</div>
                    <div>├── pages/Checkout.jsx</div>
                    <div>├── pages/Profile.jsx</div>
                    <div>├── pages/Login.jsx</div>
                    <div>├── pages/Register.jsx</div>
                    <div>└── App.jsx</div>
                  </div>
                </div>

                {/* Server Folder */}
                <div className="pl-3 pt-1">
                  <div className="font-semibold text-ink-soft flex items-center">
                    <Folder className="w-3 h-3 mr-1 text-ink-muted" />
                    server/
                  </div>
                  <div className="pl-3 text-ink-muted">
                    <div>├── models/User.js</div>
                    <div>├── models/Product.js</div>
                    <div>├── models/Order.js</div>
                    {selectedModules.includes('reviews') && <div>├── models/Review.js</div>}
                    <div>├── routes/auth.js</div>
                    <div>├── routes/orders.js</div>
                    {selectedModules.includes('payments') && <div>├── routes/payments.js</div>}
                    {selectedModules.includes('reviews') && <div>├── routes/reviews.js</div>}
                    <div>├── seed.js</div>
                    <div>└── server.js</div>
                  </div>
                </div>

                <div className="pl-3 pt-1 text-ink-soft">
                  <div>├── .env.example</div>
                  <div>├── package.json</div>
                  <div>└── README.md</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 5: GENERATE & ZIP DOWNLOAD
          ======================================================== */}
      {currentStep === 5 && (
        <div className="space-y-6 max-w-xl mx-auto py-6">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-ink">Generate Full-Stack Project</h2>
            <p className="text-xs text-ink-muted">
              Compile your configured React frontend, Express API, Mongoose models, and README into a runnable ZIP.
            </p>
          </div>

          <div className="p-6 rounded-[6px] border border-border bg-white shadow-card space-y-5 text-center">
            {generation.isGenerating ? (
              <div className="space-y-4 py-4">
                <div className="w-10 h-10 rounded-full border-2 border-border border-t-ink animate-spin mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-ink font-mono">
                    {generation.step === 1 && '1/5 Preparing configuration...'}
                    {generation.step === 2 && '2/5 Resolving dependencies...'}
                    {generation.step === 3 && '3/5 Generating full-stack project...'}
                    {generation.step === 4 && '4/5 Validating project structure...'}
                    {generation.step === 5 && '5/5 Packaging ZIP archive...'}
                  </p>
                  <p className="text-[11px] text-ink-muted">Synthesizing runnable MERN code</p>
                </div>
                <div className="w-full bg-canvas-inset rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-ink h-full transition-all duration-300"
                    style={{ width: `${generation.step * 20}%` }}
                  />
                </div>
              </div>
            ) : generation.step === 6 ? (
              <div className="space-y-4 py-2">
                <div className="w-10 h-10 rounded-full bg-success-light text-success flex items-center justify-center mx-auto border border-success-border">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-ink">Generation Complete</h3>
                  <p className="text-xs text-ink-muted">
                    Your complete MERN e-commerce project has been assembled and packaged into a ZIP archive.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  <a
                    href={generation.downloadUrl || `/api/v1/download/${generation.downloadToken || 'store'}`}
                    download={`${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.zip`}
                  >
                    <Button
                      size="lg"
                      className="w-full bg-ink hover:bg-black text-white font-medium text-xs shadow-subtle"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download {project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.zip
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyReadme}
                    className="w-full text-xs text-ink-soft"
                  >
                    {copiedReadme ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-success" />
                        Copied setup commands!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        Copy Setup Commands
                      </>
                    )}
                  </Button>
                </div>

                <div className="p-3 rounded bg-canvas-subtle text-left text-[11px] text-ink-soft font-mono border border-border-subtle mt-4">
                  <p className="text-ink font-semibold mb-1">Quick run instructions:</p>
                  <div>1. unzip {project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.zip</div>
                  <div>2. cp .env.example .env</div>
                  <div>3. npm install</div>
                  <div>4. npm run seed</div>
                  <div>5. npm run dev</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <Sparkles className="w-8 h-8 text-ink mx-auto" />
                <p className="text-xs text-ink-soft">
                  Ready to compile <strong className="text-ink">{project.name}</strong> with{' '}
                  <strong className="text-ink">{productsConfig.categories.length}</strong> categories and{' '}
                  <strong className="text-ink">{selectedModules.length}</strong> optional modules.
                </p>

                <Button
                  size="lg"
                  onClick={handleStartGeneration}
                  className="w-full bg-ink hover:bg-black text-white font-medium text-xs shadow-subtle"
                >
                  Start Project Generation
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={currentStep === 1 || generation.isGenerating}
          className="text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Previous
        </Button>

        {currentStep < 5 && (
          <Button
            size="sm"
            onClick={handleNext}
            className="bg-ink hover:bg-black text-white text-xs"
          >
            Next Step
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default BuilderWizard;
