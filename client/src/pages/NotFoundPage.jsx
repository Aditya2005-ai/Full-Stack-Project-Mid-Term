import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { FileQuestion } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col justify-center items-center p-6 text-center">
      <div className="max-w-md w-full p-8 border border-surface-800 bg-surface-900/60 rounded-xl space-y-4">
        <FileQuestion className="w-12 h-12 text-brand-400 mx-auto" />
        <h2 className="text-3xl font-extrabold text-slate-100">404</h2>
        <h3 className="text-sm font-semibold text-slate-300">Page Not Found</h3>
        <p className="text-xs text-slate-400">
          The requested page or route does not exist in the code generator application.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button size="sm">Return to Safety</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
