import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { ShieldAlert } from 'lucide-react';

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col justify-center items-center p-6 text-center">
      <div className="max-w-md w-full p-8 border border-amber-900/50 bg-amber-950/20 rounded-xl space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-100">Access Restricted</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          You do not have the required permissions or authentication token to view this route.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm">Go Home</Button>
          </Link>
          <Link to="/login">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
