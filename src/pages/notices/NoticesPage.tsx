import React, { useState, useMemo } from 'react';
import {
  Bell,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Info,
  User,
  ChevronRight,
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { CampusNotice, NoticeCategory } from '../../types/campusly';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const NoticesPage: React.FC = () => {
  const { notices, unreadNoticesCount, markNoticeRead, markAllNoticesRead } = useCampus();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotice, setActiveNotice] = useState<CampusNotice | null>(null);

  const categories: NoticeCategory[] = [
    'Examinations',
    'Academic',
    'Events',
    'Deadlines',
    'Placement',
  ];

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const matchCat = selectedCategory === 'all' || n.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [notices, selectedCategory, searchQuery]);

  const handleOpenNotice = (notice: CampusNotice) => {
    markNoticeRead(notice.id);
    setActiveNotice(notice);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-indigo-600" />
            University Announcements & Circulars
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Official institutional notices, exam schedules, guest workshops, and placement circulars
          </p>
        </div>

        {unreadNoticesCount > 0 && (
          <button
            type="button"
            onClick={markAllNoticesRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mark all {unreadNoticesCount} as read
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Notices ({notices.length})
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === c
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {filteredNotices.map((n) => (
          <div
            key={n.id}
            onClick={() => handleOpenNotice(n)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
              !n.read
                ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-90'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />}
                <Badge
                  variant={
                    n.priority === 'urgent'
                      ? 'danger'
                      : n.priority === 'important'
                      ? 'warning'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {n.priority}
                </Badge>
                <Badge variant="outline" size="sm">
                  {n.category}
                </Badge>
                <span className="text-xs text-slate-400 flex items-center gap-1 ml-2">
                  <Calendar className="w-3 h-3" />
                  {n.date}
                </span>
              </div>

              <span className="text-xs text-slate-500 font-medium">{n.author}</span>
            </div>

            <div className="mt-2.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{n.title}</h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {n.summary}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-end text-xs text-indigo-600 dark:text-indigo-400 font-semibold gap-1">
              <span>Read Full Circular</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Notice Detail Modal */}
      <Modal
        isOpen={Boolean(activeNotice)}
        onClose={() => setActiveNotice(null)}
        title={activeNotice?.title || 'Notice Detail'}
        maxWidth="2xl"
      >
        {activeNotice && (
          <div className="space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-slate-500">
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm">
                  {activeNotice.category}
                </Badge>
                <span>Issued: {activeNotice.date}</span>
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Author: {activeNotice.author}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 leading-relaxed text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line">
              {activeNotice.fullContent}
            </div>

            <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-300">
              This notice is synchronized with your student portal. For urgent administrative appeals, visit the Registrar's Office during academic hours.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
