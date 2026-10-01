import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card.jsx';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import { useBuilderStore } from '../../store/builderStore.js';
import { Sparkles, ArrowRight, Palette, DollarSign, Store, Image, Check } from 'lucide-react';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' }
];

const THEMES = [
  { name: 'Indigo Dev', color: '#6366F1' },
  { name: 'Teal Modern', color: '#14B8A6' },
  { name: 'Amber Glow', color: '#F59E0B' },
  { name: 'Emerald Commerce', color: '#10B981' },
  { name: 'Violet Premium', color: '#8B5CF6' }
];

const QUICK_MODULES = [
  { id: 'products', name: 'Products' },
  { id: 'cart', name: 'Cart' },
  { id: 'orders', name: 'Orders' },
  { id: 'payments', name: 'Payments' },
  { id: 'auth', name: 'Auth' },
  { id: 'admin', name: 'Admin Dashboard' }
];

export const StoreBasicsForm = ({ onCreated }) => {
  const navigate = useNavigate();
  const { setProject, setSelectedModules, setCurrentStep } = useBuilderStore();

  const [formData, setFormData] = useState({
    name: 'Bloom Boutique',
    description: 'Curated premium organic goods & handcrafted accessories',
    currency: 'INR',
    theme: '#6366F1',
    logoUrl: ''
  });

  const [selectedQuickModules, setSelectedQuickModules] = useState(['products', 'cart', 'auth']);

  const handleToggleModule = (id) => {
    setSelectedQuickModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProject({
      name: formData.name,
      description: formData.description,
      currency: formData.currency,
      theme: formData.theme,
      logoUrl: formData.logoUrl
    });
    setSelectedModules(selectedQuickModules);
    setCurrentStep(2); // Jump to Module Selection in Builder

    if (onCreated) {
      onCreated({ ...formData, modules: selectedQuickModules });
    } else {
      navigate('/build');
    }
  };

  return (
    <Card
      title="Create New Store — Store Basics Form"
      subtitle="Step 1 as specified in Problem Statement 06: Configure store essentials to cook your code generator"
      className="border-brand-500/30 shadow-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Store Name *"
            placeholder="e.g. Bloom Boutique"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center">
              <DollarSign className="w-3.5 h-3.5 mr-1 text-accent" />
              Currency
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CURRENCIES.map((c) => (
                <button
                  type="button"
                  key={c.code}
                  onClick={() => setFormData({ ...formData, currency: c.code })}
                  className={`px-3 py-2 text-xs font-semibold rounded-md border text-center transition-all ${
                    formData.currency === c.code
                      ? 'bg-brand-600 text-white border-brand-500 ring-2 ring-brand-500/30'
                      : 'bg-surface-900 text-slate-300 border-surface-700 hover:border-surface-600'
                  }`}
                >
                  {c.symbol} {c.code}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Input
          label="Short Store Description"
          placeholder="Brief description for generated site meta and headers"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center">
              <Palette className="w-3.5 h-3.5 mr-1 text-primary-light" />
              Storefront Color Theme
            </label>
            <div className="flex items-center space-x-2.5">
              {THEMES.map((t) => (
                <button
                  type="button"
                  key={t.color}
                  onClick={() => setFormData({ ...formData, theme: t.color })}
                  title={t.name}
                  className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                    formData.theme === t.color ? 'scale-110 ring-2 ring-white' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: t.color }}
                >
                  {formData.theme === t.color && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
              <span className="text-xs text-muted font-mono ml-2">{formData.theme}</span>
            </div>
          </div>

          <Input
            label="Logo URL (Optional)"
            placeholder="https://example.com/logo.png"
            value={formData.logoUrl}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
          />
        </div>

        {/* Quick Module Selection */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
            <span>Pre-select Core Modules (can refine in Builder)</span>
            <span className="text-[11px] text-muted">{selectedQuickModules.length} selected</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {QUICK_MODULES.map((m) => {
              const isSelected = selectedQuickModules.includes(m.id);
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => handleToggleModule(m.id)}
                  className={`p-2.5 rounded-md text-xs font-medium border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-surface-800 border-primary text-text'
                      : 'bg-surface-900 border-surface-700 text-muted hover:text-text'
                  }`}
                >
                  <span>{m.name}</span>
                  {isSelected && <Badge variant="brand" className="text-[10px]">Selected</Badge>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-surface-800">
          <div className="flex items-center space-x-2 text-xs text-muted">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Dependency auto-resolution will calculate on Next</span>
          </div>

          <Button type="submit" size="md" className="bg-primary hover:bg-primary-hover shadow-md">
            Save & Continue to Builder
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default StoreBasicsForm;
