import React, { useState, useMemo } from 'react';
import {
  Award,
  Download,
  Printer,
  TrendingUp,
  FileText,
  Filter,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useCampus } from '../../context/CampusContext';
import { Badge } from '../../components/common/Badge';

export const ResultsPage: React.FC = () => {
  const { profile, subjects, cgpa, semesterTrends } = useCampus();
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');

  const availableSemesters = useMemo(() => {
    return Array.from(new Set(subjects.map((s) => s.semester))).sort((a, b) => a - b);
  }, [subjects]);

  const displayedSubjects = useMemo(() => {
    if (selectedSemester === 'all') return subjects;
    return subjects.filter((s) => s.semester === selectedSemester);
  }, [subjects, selectedSemester]);

  const totalCredits = useMemo(() => {
    return displayedSubjects.reduce((acc, s) => acc + s.credits, 0);
  }, [displayedSubjects]);

  const averageMarks = useMemo(() => {
    if (displayedSubjects.length === 0) return 0;
    const total = displayedSubjects.reduce((acc, s) => acc + s.marks, 0);
    return (total / displayedSubjects.length).toFixed(1);
  }, [displayedSubjects]);

  // Export CSV function
  const handleExportCSV = () => {
    const headers = ['Semester', 'Academic Year', 'Course Code', 'Course Title', 'Credits', 'Marks', 'Grade', 'Grade Points', 'Status'];
    const rows = displayedSubjects.map((s) => [
      `Sem ${s.semester}`,
      s.academicYear,
      s.subjectCode,
      `"${s.subjectName.replace(/"/g, '""')}"`,
      s.credits,
      `${s.marks}%`,
      s.grade,
      s.gradePoints,
      s.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `campusly_results_summary_${profile.studentId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto print:p-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-indigo-600" />
            Results & Academic Transcript Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Official grading scale based on UGC 10-point credit-weighted evaluation
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Download Summary (CSV)
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p>
          <strong>Student Prototype Notice:</strong> This summary statement is generated from local
          and student-maintained records. Official transcripts must be requested directly from the
          Office of Controller of Examinations.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">Cumulative CGPA</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            {cgpa.toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Scale of 10.0</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Credits</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {totalCredits}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Registered Credits</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">Average Score</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {averageMarks}%
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Mean subject score</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">Passing Rate</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            100%
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">0 backlogs / back-papers</p>
        </div>
      </div>

      {/* Recharts Area Curve */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Cumulative Trajectory by Semester
            </h2>
            <p className="text-xs text-slate-500">Historical performance evolution across enrolled terms</p>
          </div>
          <Badge variant="primary" size="sm">
            5 Semesters Logged
          </Badge>
        </div>

        <div className="mt-4 h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={semesterTrends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSgpa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="semesterLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[6.0, 10.0]} ticks={[6, 7, 8, 9, 10]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                formatter={(val: any) => [`${val} SGPA`, 'Semester GPA']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Area
                type="monotone"
                dataKey="sgpa"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSgpa)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Selector & Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Filter by Semester:
            </span>
            <select
              value={selectedSemester}
              onChange={(e) =>
                setSelectedSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Semesters (Comprehensive)</option>
              {availableSemesters.map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-slate-500">
            {displayedSubjects.length} records in this view
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Subject Description</th>
                <th className="py-3 px-3 text-center">Semester</th>
                <th className="py-3 px-3 text-center">Credits</th>
                <th className="py-3 px-3 text-center">Marks</th>
                <th className="py-3 px-3 text-center">Grade Point</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedSubjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {sub.subjectCode}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {sub.subjectName}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400">
                    Sem {sub.semester}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                    {sub.credits}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">
                    {sub.marks}%
                  </td>
                  <td className="py-3 px-3 text-center font-extrabold text-indigo-600 dark:text-indigo-400">
                    {sub.grade} ({sub.gradePoints})
                  </td>
                  <td className="py-3 px-3 text-center">
                    {sub.status === 'unverified' ? (
                      <Badge variant="unverified" size="sm">
                        Unverified
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        Passed
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
