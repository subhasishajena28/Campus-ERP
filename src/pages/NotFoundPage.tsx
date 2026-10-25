import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6">
        <GraduationCap className="w-9 h-9" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
        404 — Page Not Found
      </span>

      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Academic Route Does Not Exist
      </h1>

      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-md">
        The course, module, or portal page you are looking for has been moved or is outside your current enrollment catalog.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/app/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Return to Dashboard
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
        >
          <Home className="w-4 h-4" />
          Public Homepage
        </Link>
      </div>
    </div>
  );
};
