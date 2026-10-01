import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import BuildStatus from '../components/builds/BuildStatus.jsx';
import { ArrowLeft, Download, Terminal, Layers } from 'lucide-react';

export const BuildDetailsPage = () => {
  const { id } = useParams();

  return (
    <PageContainer
      title={`Build: ${id}`}
      subtitle="Detailed configuration, generation logs, and export artifacts"
      actions={
        <div className="flex items-center space-x-2">
          <Link to="/builds">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={async () => {
              const url = `/api/v1/builds/${id}/download`;
              try {
                const token = localStorage.getItem('auth_token');
                const res = await fetch(url, {
                  headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const blob = await res.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `${id}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl);
              } catch {
                window.location.href = url;
              }
            }}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download ZIP
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Project Summary" subtitle="Configuration parameters for this build">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400">Project Name</p>
                <p className="font-semibold text-slate-200 mt-0.5">vintage-apparel</p>
              </div>
              <div>
                <p className="text-slate-400">Database Engine</p>
                <p className="font-semibold text-slate-200 mt-0.5">MongoDB / Mongoose</p>
              </div>
              <div>
                <p className="text-slate-400">Backend Port</p>
                <p className="font-semibold text-slate-200 mt-0.5">5000</p>
              </div>
              <div>
                <p className="text-slate-400">Status</p>
                <div className="mt-0.5"><BuildStatus status="completed" /></div>
              </div>
            </div>
          </Card>

          <Card title="Generation Audit Log" subtitle="Real-time execution pipeline steps">
            <div className="bg-surface-950 rounded p-4 font-mono text-xs text-slate-300 space-y-1.5 border border-surface-800">
              <div className="text-slate-500">[INFO] Pipeline initialized</div>
              <div className="text-slate-500">[INFO] Resolving DAG module dependencies...</div>
              <div className="text-emerald-400">[SUCCESS] Resolved modules: auth, products, cart, orders</div>
              <div className="text-slate-500">[INFO] Rendering templates...</div>
              <div className="text-slate-500">[INFO] Formatting code output...</div>
              <div className="text-emerald-400">[SUCCESS] Package created: vintage-apparel.zip</div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card title="Included Modules" subtitle="4 active modules">
            <div className="space-y-2">
              {['auth', 'products', 'cart', 'orders'].map((m) => (
                <div key={m} className="flex items-center justify-between p-2 rounded bg-surface-950/60 border border-surface-800 text-xs">
                  <span className="font-medium text-slate-200">{m}</span>
                  <Badge variant="brand">v1.0.0</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default BuildDetailsPage;
