import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Award,
  CalendarCheck,
  AlertTriangle,
  Briefcase,
  CreditCard,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  FileText,
  User,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { useCampus } from '../../context/CampusContext';
import { MetricCard } from '../../components/common/MetricCard';
import { Badge } from '../../components/common/Badge';

export const DashboardPage: React.FC = () => {
  const {
    profile,
    subjects,
    attendance,
    fees,
    projects,
    timetable,
    tasks,
    notices,
    cgpa,
    overallAttendance,
    subjectsNeedingAttention,
    semesterTrends,
    totalFeeAssessed,
    totalFeePaid,
    feeBalance,
    minAttendanceThreshold,
  } = useCampus();

  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState<number>(profile.currentSemester || 5);

  // Filter subjects for the selected semester bar chart
  const currentSemesterSubjects = useMemo(() => {
    return subjects.filter((s) => s.semester === selectedSemester);
  }, [subjects, selectedSemester]);

  const availableSemesters = useMemo(() => {
    const sems = Array.from(new Set(subjects.map((s) => s.semester))).sort((a, b) => a - b);
    return sems.length > 0 ? sems : [1, 2, 3, 4, 5];
  }, [subjects]);

  const greetingTime = useMemo(() => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Format currency in INR
  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  const pendingTasks = useMemo(() => tasks.filter((t) => !t.completed).slice(0, 3), [tasks]);
  const upcomingSchedule = useMemo(() => timetable.slice(0, 3), [timetable]);
  const latestNotices = useMemo(() => notices.slice(0, 2), [notices]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ---------------- 1. Welcome Section ---------------- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {greetingTime}, {profile.fullName.split(' ')[0]} 👋
              </h1>
              {profile.isDemoUser && (
                <Badge variant="unverified" size="sm">
                  Demo Account
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {profile.degree} in {profile.specialization} • Semester {profile.currentSemester} (Class of {profile.graduationYear})
            </p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              {profile.institutionName} • Enrollment ID: {profile.studentId}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <Link
              to="/app/ai-advisor"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask AI Copilot
            </Link>

            <Link
              to="/app/results"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-indigo-500" />
              View Results
            </Link>

            <Link
              to="/app/portfolio"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-500" />
              Add Project
            </Link>

            <Link
              to="/app/profile"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              Profile
            </Link>
          </div>
        </div>
      </div>

      {/* ---------------- 2. Key Metric Cards ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Current CGPA"
          value={cgpa > 0 ? cgpa.toFixed(2) : 'N/A'}
          subtext="Cumulative 10-point scale"
          icon={Award}
          trend={{ value: '+0.12 vs Sem 4', isPositive: true }}
          variant="default"
          onClick={() => navigate('/app/results')}
        />

        <MetricCard
          title="Overall Attendance"
          value={`${overallAttendance.percentage}%`}
          subtext={`${overallAttendance.attended} of ${overallAttendance.total} attended`}
          icon={CalendarCheck}
          trend={{
            value: overallAttendance.percentage >= minAttendanceThreshold ? 'Above 75%' : 'At Risk',
            isPositive: overallAttendance.percentage >= minAttendanceThreshold,
          }}
          variant={overallAttendance.percentage >= minAttendanceThreshold ? 'emerald' : 'warning'}
          onClick={() => navigate('/app/attendance')}
        />

        <MetricCard
          title="Subjects Needing Attention"
          value={subjectsNeedingAttention.length}
          subtext={
            subjectsNeedingAttention.length > 0
              ? `${subjectsNeedingAttention[0].subjectCode} requires focus`
              : 'All courses healthy'
          }
          icon={AlertTriangle}
          trend={{
            value: subjectsNeedingAttention.length > 0 ? 'Action Needed' : 'Good Standing',
            isPositive: subjectsNeedingAttention.length === 0,
          }}
          variant={subjectsNeedingAttention.length > 0 ? 'warning' : 'emerald'}
          onClick={() => navigate('/app/academics')}
        />

        <MetricCard
          title="Showcase Projects"
          value={projects.length}
          subtext={`${projects.filter((p) => p.featured).length} marked featured`}
          icon={Briefcase}
          trend={{ value: 'Recruiter Ready', isNeutral: true }}
          variant="accent"
          onClick={() => navigate('/app/portfolio')}
        />

        <MetricCard
          title="Fee Balance"
          value={feeBalance > 0 ? formatINR(feeBalance) : 'Settled'}
          subtext={feeBalance > 0 ? 'Next due Nov 15, 2026' : 'All semesters paid'}
          icon={CreditCard}
          trend={{
            value: feeBalance > 0 ? 'Due Pending' : 'Paid in Full',
            isPositive: feeBalance === 0,
          }}
          variant={feeBalance > 0 ? 'warning' : 'emerald'}
          onClick={() => navigate('/app/fees')}
        />
      </div>

      {/* ---------------- 3. AI Learning Pulse Callout ---------------- */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-radial from-indigo-500/20 to-transparent pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/10 text-cyan-300 backdrop-blur-xs shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Your Learning Pulse
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-700/80 text-indigo-200">
                  Data Science Diagnostic
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-100 max-w-2xl">
                Attendance in <strong>Cloud Computing & DevOps (CS301)</strong> is currently at{' '}
                <strong className="text-amber-300">70.0%</strong>. To clear the 75% institutional criteria, you
                need to attend the next <strong>8 sessions</strong>. Your overall SGPA trajectory remains positive.
              </p>
            </div>
          </div>
          <Link
            to="/app/ai-advisor"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-white text-indigo-900 hover:bg-indigo-50 shrink-0 transition-colors"
          >
            Open Copilot
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ---------------- 4. Performance Analytics Grid ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Semester-wise CGPA Trend Line Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Semester-wise SGPA Performance Trend
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Progression across semesters on a 10-point credit-weighted scale
              </p>
            </div>
            <Badge variant="primary" size="sm">
              Current CGPA: {cgpa.toFixed(2)}
            </Badge>
          </div>

          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={semesterTrends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis
                  dataKey="semesterLabel"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[6.0, 10.0]}
                  ticks={[6.0, 7.0, 8.0, 9.0, 10.0]}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} SGPA`, 'Semester GPA']}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sgpa"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#06b6d4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Peak: Sem 2 (8.63 SGPA)</span>
            <span>Total Credits Completed: 88</span>
            <Link
              to="/app/results"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Detailed Breakdown →
            </Link>
          </div>
        </div>

        {/* Subject-wise Marks Bar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-600" />
                  Subject Score Analytics
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Marks percentage by subject</p>
              </div>

              {/* Semester Selector */}
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                {availableSemesters.map((s) => (
                  <option key={s} value={s}>
                    Sem {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentSemesterSubjects} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.4} />
                  <XAxis
                    dataKey="subjectCode"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(val: any, _name, item: any) => [
                      `${val}% (${item.payload.grade})`,
                      item.payload.subjectName,
                    ]}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="marks" radius={[4, 4, 0, 0]}>
                    {currentSemesterSubjects.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.marks < 70 ? '#f59e0b' : entry.marks >= 85 ? '#4f46e5' : '#06b6d4'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" /> &gt;85% High
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 ml-2" /> &lt;70% Focus
            </span>
            <Link to="/app/academics" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Manage Subjects →
            </Link>
          </div>
        </div>
      </div>

      {/* ---------------- 5. Attendance & Timetable & Tasks ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                Attendance Monitor
              </h2>
              <p className="text-xs text-slate-500">
                Minimum threshold requirement: {minAttendanceThreshold}%
              </p>
            </div>
            <Link
              to="/app/attendance"
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Full Log →
            </Link>
          </div>

          {/* Subject Attendance Bars */}
          <div className="space-y-3">
            {attendance.slice(0, 5).map((att) => {
              const pct = att.totalClasses > 0 ? Number(((att.classesAttended / att.totalClasses) * 100).toFixed(1)) : 100;
              const isBelow = pct < minAttendanceThreshold;
              return (
                <div key={att.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {att.subjectName}
                    </span>
                    <span
                      className={`font-bold ${
                        isBelow ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {pct}% ({att.classesAttended}/{att.totalClasses})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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

          {/* Warning banner if any below */}
          {subjectsNeedingAttention.some((s) => (s.attendancePercentage || 100) < minAttendanceThreshold) && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Institutional Policy Alert: Attendance under {minAttendanceThreshold}% requires remedial
                attendance prior to semester examinations.
              </span>
            </div>
          )}
        </div>

        {/* Upcoming Timetable & Tasks (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Next Schedule Slots */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Upcoming Classes
                </h3>
                <Link
                  to="/app/timetable"
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Timetable →
                </Link>
              </div>

              <div className="mt-3 space-y-2.5">
                {upcomingSchedule.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span>{ev.subjectName}</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {ev.startTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>{ev.dayOfWeek} • {ev.room}</span>
                      <Badge variant="neutral" size="sm">
                        {ev.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-400">Regular Semester 5 Schedule</span>
            </div>
          </div>

          {/* Pending Tasks & Deadlines */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Tasks & Milestones
                </h3>
                <Link
                  to="/app/timetable"
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Manage →
                </Link>
              </div>

              <div className="mt-3 space-y-2.5">
                {pendingTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs flex items-start justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {t.title}
                      </p>
                      <p className="text-[11px] text-slate-500">Due: {t.dueDate}</p>
                    </div>
                    <Badge
                      variant={t.priority === 'high' ? 'danger' : 'neutral'}
                      size="sm"
                    >
                      {t.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>{pendingTasks.length} pending items</span>
              <Link to="/app/timetable" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Add Task +
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
