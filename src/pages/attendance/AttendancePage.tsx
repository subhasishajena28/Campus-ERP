import React, { useState } from 'react';
import {
  CalendarCheck,
  AlertTriangle,
  Plus,
  Edit2,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  Info,
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { AttendanceRecord } from '../../types/campusly';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const AttendancePage: React.FC = () => {
  const {
    attendance,
    overallAttendance,
    minAttendanceThreshold,
    setMinAttendanceThreshold,
    updateAttendance,
    addAttendanceRecord,
  } = useCampus();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AttendanceRecord | null>(null);

  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formSemester, setFormSemester] = useState<number>(5);
  const [formAttended, setFormAttended] = useState<number>(30);
  const [formTotal, setFormTotal] = useState<number>(35);
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setFormCode('');
    setFormName('');
    setFormSemester(5);
    setFormAttended(30);
    setFormTotal(36);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (att: AttendanceRecord) => {
    setEditingItem(att);
    setFormCode(att.subjectCode);
    setFormName(att.subjectName);
    setFormSemester(att.semester);
    setFormAttended(att.classesAttended);
    setFormTotal(att.totalClasses);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (formAttended > formTotal) {
      setFormError('Attended classes cannot exceed total classes conducted.');
      return;
    }

    if (formTotal < 1) {
      setFormError('Total classes must be at least 1.');
      return;
    }

    if (editingItem) {
      updateAttendance(editingItem.id, formAttended, formTotal);
    } else {
      if (!formCode || !formName) {
        setFormError('Please provide subject code and title.');
        return;
      }
      addAttendanceRecord({
        subjectCode: formCode.trim().toUpperCase(),
        subjectName: formName.trim(),
        semester: Number(formSemester),
        classesAttended: Number(formAttended),
        totalClasses: Number(formTotal),
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="w-7 h-7 text-emerald-600" />
            Attendance Intelligence & Regulatory Compliance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Session tracking with threshold alerts and minimum attendance forecasting
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Simulate Course Attendance
        </button>
      </div>

      {/* Threshold Configurator & Aggregate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">Overall Aggregate</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {overallAttendance.percentage}%
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>{overallAttendance.attended} Attended</span>
            <span>•</span>
            <span className="text-rose-500 font-semibold">{overallAttendance.missed} Missed</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Classes Conducted</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {overallAttendance.total}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Across 6 Semester 5 Courses</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Min. Threshold</p>
            <span className="text-xs font-bold text-indigo-600">{minAttendanceThreshold}%</span>
          </div>
          <div className="mt-3">
            <input
              type="range"
              min={60}
              max={85}
              value={minAttendanceThreshold}
              onChange={(e) => setMinAttendanceThreshold(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>60%</span>
              <span>75% (Std)</span>
              <span>85%</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">Shortage Warning</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">
              {attendance.filter((a) => (a.classesAttended / a.totalClasses) * 100 < minAttendanceThreshold).length}
            </span>
            <span className="text-xs text-slate-500 font-medium">courses flagged</span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">Requires remedial focus</p>
        </div>
      </div>

      {/* Advisory Banner if below */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
        <div className="flex items-center gap-2 font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Institutional Attendance Regulation Guidelines</span>
        </div>
        <p className="text-amber-800 dark:text-amber-300">
          Institutions mandate a minimum of {minAttendanceThreshold}% attendance for final examination hall ticket issuance. In this demonstration, simulated adjustments help students calculate recovery requirements.
        </p>
      </div>

      {/* Course-wise Attendance Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Subject-wise Attendance Breakdown
          </span>
          <span className="text-xs text-slate-400">Click Edit to simulate changes</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {attendance.map((att) => {
            const pct = att.totalClasses > 0 ? Number(((att.classesAttended / att.totalClasses) * 100).toFixed(1)) : 100;
            const isBelow = pct < minAttendanceThreshold;

            // Calculate recovery classes needed to reach threshold
            // (attended + x) / (total + x) = T/100
            // x = (T*total - 100*attended) / (100 - T)
            const T = minAttendanceThreshold;
            const needed = Math.max(
              0,
              Math.ceil((T * att.totalClasses - 100 * att.classesAttended) / (100 - T))
            );

            return (
              <div
                key={att.id}
                className="p-4 sm:p-5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {att.subjectName}
                      </span>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {att.subjectCode}
                      </span>
                      {isBelow ? (
                        <Badge variant="warning" size="sm">
                          Attendance Shortage
                        </Badge>
                      ) : (
                        <Badge variant="success" size="sm">
                          Compliant
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span>Attended: <strong>{att.classesAttended}</strong></span>
                      <span>Total Conducted: <strong>{att.totalClasses}</strong></span>
                      <span>Missed: <strong className="text-rose-500">{att.totalClasses - att.classesAttended}</strong></span>
                      <span>Last Updated: {att.lastUpdated}</span>
                    </div>

                    {isBelow && needed > 0 && (
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold pt-1">
                        ⚡ Recovery Target: Attend the next <strong>{needed} consecutive classes</strong> to reach {minAttendanceThreshold}%.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span
                        className={`text-2xl font-extrabold ${
                          isBelow ? 'text-amber-600' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openEditModal(att)}
                      aria-label={`Edit attendance for ${att.subjectName}`}
                      className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isBelow ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit / Add Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? `Update Attendance (${editingItem.subjectCode})` : 'Simulate Course Attendance'}
        description="Simulate changes in classes attended to see real-time updates in your overall percentage."
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700">
              {formError}
            </div>
          )}

          {!editingItem && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Code *
                </label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="DS305"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Distributed Systems"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Classes Attended *
              </label>
              <input
                type="number"
                min={0}
                required
                value={formAttended}
                onChange={(e) => setFormAttended(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Classes Conducted *
              </label>
              <input
                type="number"
                min={1}
                required
                value={formTotal}
                onChange={(e) => setFormTotal(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="text-slate-500">Calculated Percentage:</span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
              {formTotal > 0 ? ((formAttended / formTotal) * 100).toFixed(1) : 0}%
            </span>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Save Attendance
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
