import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useBuilderStore } from '../store/builderStore.js';
import {
  FileCode,
  Folder,
  Download,
  Key,
  CheckCircle2,
  Copy,
  ArrowLeft,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';

export const ReviewPage = () => {
  const { project, selectedModules, options } = useBuilderStore();
  const [resolution, setResolution] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [copiedReadme, setCopiedReadme] = useState(false);

  // In Phase 01: Fetch or simulate resolution based on selected modules
  useEffect(() => {
    const modulesToResolve = selectedModules.length > 0 ? selectedModules : ['products', 'payments', 'reviews'];
    
    // Auto-resolve DAG
    const autoAdded = [];
    const resolvedSet = new Set(modulesToResolve);

    if (resolvedSet.has('payments') && !resolvedSet.has('orders')) {
      resolvedSet.add('orders');
      autoAdded.push({ module: 'orders', requiredBy: ['payments'] });
    }
    if (resolvedSet.has('orders') && !resolvedSet.has('cart')) {
      resolvedSet.add('cart');
      autoAdded.push({ module: 'cart', requiredBy: ['orders'] });
    }
    if ((resolvedSet.has('orders') || resolvedSet.has('reviews')) && !resolvedSet.has('auth')) {
      resolvedSet.add('auth');
      autoAdded.push({ module: 'auth', requiredBy: ['orders', 'reviews'] });
    }
    if ((resolvedSet.has('cart') || resolvedSet.has('reviews')) && !resolvedSet.has('products')) {
      resolvedSet.add('products');
      autoAdded.push({ module: 'products', requiredBy: ['cart', 'reviews'] });
    }

    const resolved = Array.from(resolvedSet);
    const envKeys = ['MONGO_URI', 'CLIENT_URL', 'PORT'];
    if (resolved.includes('auth')) envKeys.push('JWT_SECRET');
    if (resolved.includes('payments')) {
      envKeys.push('RAZORPAY_KEY_ID');
      envKeys.push('RAZORPAY_KEY_SECRET');
    }

    const fileTree = [
      'server/package.json',
      'server/src/server.js',
      'server/src/app.js',
      'client/package.json',
      'client/src/App.jsx',
      'client/src/main.jsx',
      '.env.example',
      'README.md'
    ];

    if (resolved.includes('auth')) {
      fileTree.push('server/models/User.js');
      fileTree.push('server/routes/auth.routes.js');
    }
    if (resolved.includes('products')) {
      fileTree.push('server/models/Product.js');
      fileTree.push('server/routes/product.routes.js');
    }
    if (resolved.includes('cart')) {
      fileTree.push('server/models/Cart.js');
      fileTree.push('server/routes/cart.routes.js');
    }
    if (resolved.includes('orders')) {
      fileTree.push('server/models/Order.js');
      fileTree.push('server/routes/order.routes.js');
    }
    if (resolved.includes('payments')) {
      fileTree.push('server/routes/payment.routes.js');
      fileTree.push('client/src/pages/Checkout.jsx');
    }

    setResolution({
      resolved,
      autoAdded,
      envKeys,
      fileTree
    });
  }, [selectedModules]);

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setProgressStep(1);

    setTimeout(() => {
      setProgressStep(2); // Rendering
      setTimeout(() => {
        setProgressStep(3); // Zipping
        setTimeout(() => {
          setProgressStep(4); // Ready
          setIsGenerating(false);
          setIsReady(true);
        }, 600);
      }, 600);
    }, 600);
  };

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(`# ${project.name || 'Bloom Boutique'}\n\n1. npm install\n2. cp .env.example .env\n3. npm run seed\n4. npm run dev`);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2000);
  };

  return (
    <PageContainer
      title="Review & Generate"
      subtitle="Inspect live file tree, module dependency map, required .env keys, and trigger generation"
      actions={
        <Link to="/build">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Builder
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Module Resolution & Generation CTA */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Resolved Module Map" subtitle="Transitive closure calculated via DAG">
            <div className="space-y-2 mt-2">
              {resolution?.resolved.map((mod) => {
                const auto = resolution.autoAdded.find((a) => a.module === mod);
                return (
                  <div
                    key={mod}
                    className="p-2.5 rounded-md bg-surface-900 border border-surface-700 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-text">{mod}</span>
                    {auto ? (
                      <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/30">
                        required by {auto.requiredBy.join(', ')}
                      </span>
                    ) : (
                      <Badge variant="brand" className="text-[10px]">user selected</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Prominent Generate CTA as specified in PPT (Page 12) */}
          <Card
            title="Generate & Package"
            subtitle="Assembles project folder and packages downloadable zip"
            className="border-accent/40 bg-surface-900/90"
          >
            {isGenerating ? (
              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-accent">
                  <span>
                    {progressStep === 1 && '1/3 Resolving module dependencies...'}
                    {progressStep === 2 && '2/3 Rendering templates & models...'}
                    {progressStep === 3 && '3/3 Packaging zip stream...'}
                  </span>
                  <span>{progressStep * 33}%</span>
                </div>
                <div className="w-full bg-surface-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-accent h-full transition-all duration-500 ease-out"
                    style={{ width: `${progressStep * 33}%` }}
                  />
                </div>
              </div>
            ) : isReady ? (
              <div className="py-3 space-y-3">
                <div className="p-3 rounded-md bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Package generated successfully! Ready for download.</span>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="md"
                    className="w-full bg-accent hover:bg-accent-hover text-surface-950 font-bold shadow-lg"
                    onClick={() => {
                      window.location.href = '/api/v1/download/demo-token';
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {project.name || 'ecommerce-store'}.zip
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={handleCopyReadme}
                  >
                    {copiedReadme ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        Copy Setup README
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <p className="text-xs text-muted mb-4">
                  Ready to compile <strong className="text-text">{project.name || 'Bloom Boutique'}</strong> with{' '}
                  <strong className="text-text">{resolution?.resolved.length || 0}</strong> modules.
                </p>
                <Button
                  size="lg"
                  onClick={handleStartGeneration}
                  className="w-full bg-accent hover:bg-accent-hover text-surface-950 font-bold shadow-lg shadow-accent/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate & Download ZIP
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Live File Tree & .env Keys */}
        <div className="lg:col-span-2 space-y-6">
          {/* File Tree Preview (Page 11: Monospaced file-tree that updates live) */}
          <Card
            title="Generated Project Structure"
            subtitle="File-tree preview constructed from selected module manifests"
            actions={<span className="text-xs font-mono text-muted">{resolution?.fileTree.length || 0} files</span>}
          >
            <div className="bg-surface-950 rounded-lg p-4 font-mono text-xs text-slate-300 border border-line space-y-1.5 max-h-80 overflow-y-auto">
              <div className="text-brand-300 font-bold flex items-center">
                <Folder className="w-3.5 h-3.5 mr-1.5 text-brand-400" />
                {project.name || 'bloom-boutique'}/
              </div>
              {resolution?.fileTree.map((file) => (
                <div key={file} className="pl-5 flex items-center text-slate-400 hover:text-slate-200">
                  <FileCode className="w-3.5 h-3.5 mr-1.5 text-accent" />
                  <span>{file}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Required .env Keys (Page 8 & 9) */}
          <Card
            title="Required Environment Variables (.env.example)"
            subtitle="Automatically unioned from resolved modules with comments"
          >
            <div className="bg-surface-950 rounded-lg p-4 font-mono text-xs border border-line space-y-2">
              {resolution?.envKeys.map((key) => (
                <div key={key} className="flex items-center justify-between py-1 border-b border-surface-800 last:border-0">
                  <div className="flex items-center space-x-2">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-200 font-semibold">{key}</span>
                  </div>
                  <span className="text-[11px] text-muted font-normal">
                    {key === 'MONGO_URI' && '# MongoDB connection string (e.g. mongodb://localhost:27017)'}
                    {key === 'JWT_SECRET' && '# Secret key for signing JSON Web Tokens'}
                    {key === 'RAZORPAY_KEY_ID' && '# Razorpay test Key ID'}
                    {key === 'RAZORPAY_KEY_SECRET' && '# Razorpay test Key Secret'}
                    {key === 'CLIENT_URL' && '# Frontend URL for CORS configuration'}
                    {key === 'PORT' && '# Express backend HTTP port'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default ReviewPage;
