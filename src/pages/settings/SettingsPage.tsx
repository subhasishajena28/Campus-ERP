import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Shield,
  Download,
  RotateCcw,
  LogOut,
  Sliders,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { Modal } from '../../components/common/Modal';

export const SettingsPage: React.FC = () => {
  const {
    profile,
    subjects,
    attendance,
    fees,
    projects,
    timetable,
    tasks,
    notices,
    theme,
    setTheme,
    minAttendanceThreshold,
    setMinAttendanceThreshold,
    resetToDemoData,
    logout,
  } = useCampus();

  const navigate = useNavigate();
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleExportJSON = () => {
    const data = {
      profile,
      subjects,
      attendance,
      fees,
      projects,
      timetable,
      tasks,
      notices,
      exportedAt: new Date().toISOString(),
      platform: 'CAMPUSLY ERP',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campusly_data_backup_${profile.studentId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmReset = () => {
    resetToDemoData();
    setResetModalOpen(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-indigo-600" />
          Settings & Student Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Customize UI appearance, manage alert thresholds, and control data privacy
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Demo data successfully reset to original seed state for Aarav Mehta.</span>
        </div>
      )}

      {/* 1. Theme and Display */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          Interface Theme & Display Mode
        </h2>
        <p className="text-xs text-slate-500">Choose between clean light mode or high-contrast dark mode.</p>

        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light Theme (Standard)</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-950/40 text-indigo-300 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Dark Theme</span>
          </button>
        </div>
      </div>

      {/* 2. Academic Thresholds */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" />
          Institutional Alert Thresholds
        </h2>

        <div className="space-y-2 max-w-md">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Minimum Attendance Warning Boundary:
            </span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
              {minAttendanceThreshold}%
            </span>
          </div>
          <input
            type="range"
            min={60}
            max={85}
            value={minAttendanceThreshold}
            onChange={(e) => setMinAttendanceThreshold(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">
            Subjects whose attendance drops below this number will be flagged on your dashboard with
            recovery session calculations.
          </p>
        </div>
      </div>

      {/* 3. Data Export & Privacy Notice */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          Data Handling & Privacy Notice
        </h2>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          CAMPUSLY operates with strict client-side isolation and server-side secret isolation. Your
          academic records, simulated fees, and course scores are stored locally in browser session
          storage. No private student identifiers or API keys are exposed to third-party trackers.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            Download Complete Academic Backup (.JSON)
          </button>
        </div>
      </div>

      {/* 4. Danger Zone: Reset & Sign Out */}
      <div className="bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-rose-900 dark:text-rose-200">
          Account Actions & Demo Management
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Sample Demo Data
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out of Campusly
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset Demo Data to Initial Seed?"
        description="This will restore Aarav Mehta's original courses, attendance, fees, and projects, discarding any changes you simulated."
      >
        <div className="pt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setResetModalOpen(false)}
            className="px-3 py-1.5 text-xs text-slate-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmReset}
            className="px-4 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg"
          >
            Confirm Reset
          </button>
        </div>
      </Modal>
    </div>
  );
};
