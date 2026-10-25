import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { SubjectRecord } from '../../types/campusly';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { calculateSGPA, marksToGrade } from '../../utils/academicAnalytics';

export const AcademicsPage: React.FC = () => {
  const { profile, subjects, addSubject, updateSubject, deleteSubject, cgpa } = useCampus();

  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SubjectRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formSemester, setFormSemester] = useState<number>(profile.currentSemester || 5);
  const [formAcademicYear, setFormAcademicYear] = useState('2025-2026');
  const [formSubjectCode, setFormSubjectCode] = useState('');
  const [formSubjectName, setFormSubjectName] = useState('');
  const [formCredits, setFormCredits] = useState<number>(4);
  const [formMarks, setFormMarks] = useState<number>(85);
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');

  const availableSemesters = useMemo(() => {
    return Array.from(new Set(subjects.map((s) => s.semester))).sort((a, b) => a - b);
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const matchSem = selectedSemester === 'all' || s.semester === selectedSemester;
      const matchSearch =
        searchQuery === '' ||
        s.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSem && matchSearch;
    });
  }, [subjects, selectedSemester, searchQuery]);

  const currentSGPA = useMemo(() => {
    if (selectedSemester === 'all') return null;
    return calculateSGPA(subjects, selectedSemester);
  }, [subjects, selectedSemester]);

  const openAddModal = () => {
    setEditingRecord(null);
    setFormSemester(typeof selectedSemester === 'number' ? selectedSemester : profile.currentSemester || 5);
    setFormAcademicYear('2025-2026');
    setFormSubjectCode('');
    setFormSubjectName('');
    setFormCredits(4);
    setFormMarks(80);
    setFormNotes('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (rec: SubjectRecord) => {
    setEditingRecord(rec);
    setFormSemester(rec.semester);
    setFormAcademicYear(rec.academicYear);
    setFormSubjectCode(rec.subjectCode);
    setFormSubjectName(rec.subjectName);
    setFormCredits(rec.credits);
    setFormMarks(rec.marks);
    setFormNotes(rec.notes || '');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formSubjectCode.trim() || !formSubjectName.trim()) {
      setFormError('Please enter both subject code and subject name.');
      return;
    }

    if (formMarks < 0 || formMarks > 100) {
      setFormError('Marks must be between 0 and 100.');
      return;
    }

    if (formCredits < 1 || formCredits > 10) {
      setFormError('Credits must be between 1 and 10.');
      return;
    }

    if (editingRecord) {
      updateSubject(editingRecord.id, {
        semester: Number(formSemester),
        academicYear: formAcademicYear,
        subjectCode: formSubjectCode.trim().toUpperCase(),
        subjectName: formSubjectName.trim(),
        credits: Number(formCredits),
        marks: Number(formMarks),
        notes: formNotes.trim(),
      });
    } else {
      addSubject({
        semester: Number(formSemester),
        academicYear: formAcademicYear,
        subjectCode: formSubjectCode.trim().toUpperCase(),
        subjectName: formSubjectName.trim(),
        credits: Number(formCredits),
        marks: Number(formMarks),
        status: 'unverified',
        notes: formNotes.trim(),
      });
    }

    setModalOpen(false);
  };

  const previewGrade = useMemo(() => {
    return marksToGrade(formMarks);
  }, [formMarks]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-indigo-600" />
            Academics & Course Record Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {profile.degree} • {profile.department} • Cumulative CGPA: <strong>{cgpa.toFixed(2)}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Course Record
        </button>
      </div>

      {/* Distinction Banner */}
      <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Academic Verification Policy</p>
          <p className="mt-0.5 text-amber-800 dark:text-amber-300">
            Records marked <span className="font-semibold underline">Sample Data</span> represent demonstration seeds. Records you create or edit here are clearly labeled{' '}
            <span className="font-semibold text-amber-900 dark:text-amber-100 uppercase">Unverified</span> until validated by university registrar integrations.
          </p>
        </div>
      </div>

      {/* Filter and Summary Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Semester Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) =>
                setSelectedSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
            >
              <option value="all">All Semesters (1-{availableSemesters.length})</option>
              {availableSemesters.map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search by code or course name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* SGPA / Metric pill */}
        <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-end">
          {typeof selectedSemester === 'number' && (
            <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold">
              Semester {selectedSemester} SGPA: {currentSGPA !== null ? currentSGPA.toFixed(2) : 'N/A'}
            </div>
          )}
          <span className="text-slate-500">
            Showing <strong>{filteredSubjects.length}</strong> subjects
          </span>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Course Code & Title</th>
                <th className="py-3 px-3">Sem</th>
                <th className="py-3 px-3 text-center">Credits</th>
                <th className="py-3 px-3 text-center">Marks</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSubjects.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {sub.subjectName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {sub.subjectCode} • {sub.academicYear}
                    </div>
                    {sub.notes && (
                      <p className="text-[11px] text-slate-400 italic mt-0.5">{sub.notes}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                    Sem {sub.semester}
                  </td>
                  <td className="py-3.5 px-3 text-center font-semibold text-slate-800 dark:text-slate-200">
                    {sub.credits}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        sub.marks < 70
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {sub.marks}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-indigo-600 dark:text-indigo-400">
                    {sub.grade} ({sub.gradePoints} pts)
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {sub.status === 'unverified' ? (
                      <Badge variant="unverified" size="sm">
                        Unverified
                      </Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">
                        Sample Data
                      </Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(sub)}
                        aria-label={`Edit ${sub.subjectName}`}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(sub.id)}
                        aria-label={`Delete ${sub.subjectName}`}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubjects.length === 0 && (
          <div className="py-12 text-center space-y-2">
            <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No subjects matched your filter
            </p>
            <p className="text-xs text-slate-400">
              Try switching semesters or add a new course record.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Subject Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRecord ? 'Edit Course Record' : 'Add New Academic Record'}
        description="Records manually created or updated will be tagged as Unverified student data."
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester *
              </label>
              <select
                value={formSemester}
                onChange={(e) => setFormSemester(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Year *
              </label>
              <input
                type="text"
                required
                value={formAcademicYear}
                onChange={(e) => setFormAcademicYear(e.target.value)}
                placeholder="2025-2026"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Code *
              </label>
              <input
                type="text"
                required
                value={formSubjectCode}
                onChange={(e) => setFormSubjectCode(e.target.value)}
                placeholder="DS304"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-mono"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                required
                value={formSubjectName}
                onChange={(e) => setFormSubjectName(e.target.value)}
                placeholder="Information Retrieval & Search"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Credits (1 - 6) *
              </label>
              <input
                type="number"
                min={1}
                max={6}
                required
                value={formCredits}
                onChange={(e) => setFormCredits(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Score / Marks (0 - 100) *
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={formMarks}
                onChange={(e) => setFormMarks(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Dynamic Grade Preview */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
            <span className="text-slate-500">Calculated UGC Grade:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              Grade {previewGrade.grade} ({previewGrade.gradePoints} Grade Points)
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Student Notes (Optional)
            </label>
            <input
              type="text"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="e.g. Midterm internal score"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
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
              {editingRecord ? 'Save Changes' : 'Add Course'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Academic Record?"
        description="Are you sure you want to remove this course entry? Your CGPA and SGPA will recalculate automatically."
      >
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setDeleteConfirmId(null)}
            className="px-3.5 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (deleteConfirmId) {
                deleteSubject(deleteConfirmId);
                setDeleteConfirmId(null);
              }
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white"
          >
            Confirm Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};
