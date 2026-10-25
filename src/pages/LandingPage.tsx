import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BarChart3,
  CalendarCheck,
  CreditCard,
  Briefcase,
  Bot,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { useCampus } from '../context/CampusContext';
import { Badge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  const { cgpa, overallAttendance, loginAsDemo } = useCampus();
  const navigate = useNavigate();

  const handleExploreDemo = () => {
    loginAsDemo();
    navigate('/app/dashboard');
  };

  const features = [
    {
      title: 'Academic Performance & CGPA Tracker',
      desc: 'Track semester-wise SGPA and overall CGPA with credit-weighted calculations and trend velocity.',
      icon: TrendingUp,
      badge: 'Real Analytics',
    },
    {
      title: 'Attendance Intelligence & Alerts',
      desc: 'Monitor class counts, forecast required recovery classes, and avoid institutional shortage penalties.',
      icon: CalendarCheck,
      badge: 'Configurable 75% Alert',
    },
    {
      title: 'Student Portfolio & Project Showcase',
      desc: 'Highlight technical projects, GitHub repos, deployed demos, and verified skills to recruiters.',
      icon: Briefcase,
      badge: 'Recruiter Ready',
    },
    {
      title: 'Gemini AI Academic Copilot',
      desc: 'Get data-grounded study advice, weak-subject remediation, and project description enhancements.',
      icon: Sparkles,
      badge: 'Powered by Gemini',
    },
    {
      title: 'Fee Status & Simulated Ledger',
      desc: 'Transparent tracking of tuition, lab, and examination assessments with downloadable demo receipts.',
      icon: CreditCard,
      badge: 'INR Accounting',
    },
    {
      title: 'Smart Timetable & Task Milestones',
      desc: 'Weekly, daily, and compact schedules synchronized with assignment deadlines and exam dates.',
      icon: Clock,
      badge: 'Interactive Schedule',
    },
    {
      title: 'Personalized Study Planner',
      desc: 'AI-generated revision schedules balanced around difficult subjects and upcoming assessments.',
      icon: Brain,
      badge: 'Automated Plan',
    },
    {
      title: 'Data Science & Correlation Insights',
      desc: 'Exploratory data analysis uncovering attendance and grade patterns with statistical rigor.',
      icon: BarChart3,
      badge: 'B.Tech Specialization',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      {/* ---------------- Hero Section ---------------- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
        <div className="absolute inset-0 bg-radial-[at_top_right] from-indigo-50/70 via-transparent to-transparent dark:from-indigo-950/20 dark:via-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                <span>AI-Powered Academic Intelligence & ERP</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Everything about your student life.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500">
                  One intelligent dashboard.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Manage your academics, track your progress, organize your portfolio, and make smarter
                learning decisions with AI-powered insights.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  type="button"
                  onClick={handleExploreDemo}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  Explore Demo Dashboard
                </button>

                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all hover:-translate-y-0.5 shadow-xs"
                >
                  Create Free Account
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* Proof badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Real-time CGPA Math</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Interactive Recharts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Gemini 3.8 Copilot</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>No Setup Required</span>
                </div>
              </div>
            </div>

            {/* Right Column: Sophisticated Interactive Live Dashboard Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none rounded-2xl p-1 bg-gradient-to-b from-indigo-500/20 via-cyan-500/10 to-transparent shadow-2xl">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
                  {/* Mock Window Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Aarav Mehta • Sem 5 B.Tech Data Science
                      </span>
                    </div>
                    <Badge variant="primary" size="sm">
                      Demo Preview
                    </Badge>
                  </div>

                  {/* Top Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                      <p className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase">
                        Cumulative CGPA
                      </p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          {cgpa.toFixed(2)}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded">
                          Top 10%
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Weighted across 5 semesters
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/50">
                      <p className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 uppercase">
                        Overall Attendance
                      </p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          {overallAttendance.percentage}%
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded">
                          Good
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {overallAttendance.attended} of {overallAttendance.total} sessions
                      </p>
                    </div>
                  </div>

                  {/* AI Learning Pulse Preview */}
                  <div className="p-3.5 rounded-lg bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200/80 dark:border-indigo-800/80">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                        Campus AI • Learning Pulse
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      Cloud Computing attendance is at <strong>70%</strong>. Need 8 consecutive
                      classes to clear institutional criteria. Midterm review scheduled.
                    </p>
                  </div>

                  {/* Mini Timetable preview */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Today's Next Class
                    </p>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          DS301: Advanced Machine Learning
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Hall B-204 • Dr. Radhika Sen
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        09:00 AM
                      </span>
                    </div>
                  </div>

                  {/* Action row */}
                  <button
                    type="button"
                    onClick={handleExploreDemo}
                    className="w-full py-2.5 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 rounded-lg transition-colors cursor-pointer"
                  >
                    Open Live Working Applet →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Features Grid ---------------- */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Integrated Capabilities
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              A comprehensive academic ecosystem built for data-minded students
            </p>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              From calculating credit-weighted SGPA to generating personalized study plans and
              presenting machine learning projects to recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {f.badge}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- How It Works Section ---------------- */}
      <section id="how-it-works" className="py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Methodology
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              How CAMPUSLY elevates student success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <span className="text-4xl font-extrabold text-indigo-100 dark:text-indigo-950 absolute top-4 right-4">
                01
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Unified Data Capture
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Log semester grades, course credits, attendance logs, and fee receipts in one place.
                Official records remain distinct from student-entered unverified scores.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <span className="text-4xl font-extrabold text-indigo-100 dark:text-indigo-950 absolute top-4 right-4">
                02
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Intelligence & Diagnostics
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Mathematical engines analyze SGPA deltas, flag attendance shortage threats below 75%,
                and reveal exploratory patterns between study time and results.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <span className="text-4xl font-extrabold text-indigo-100 dark:text-indigo-950 absolute top-4 right-4">
                03
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Action & Recruiter Showcase
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Ask Gemini to generate structured weekly revision plans, refine project descriptions,
                and showcase an impressive portfolio for internship recruiters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Final CTA Banner ---------------- */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <GraduationCap className="w-12 h-12 mx-auto text-indigo-300" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to experience next-generation academic intelligence?
          </h2>
          <p className="text-indigo-200 max-w-xl mx-auto text-sm sm:text-base">
            Explore the live prototype now as third-year student Aarav Mehta, or create your own
            custom academic profile.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleExploreDemo}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg cursor-pointer transition-transform hover:-translate-y-0.5"
            >
              Launch Demo Dashboard
            </button>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-500/50 transition-colors"
            >
              Register Free
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">CAMPUSLY</span>
            <span className="text-slate-400">— Independent Student ERP Prototype</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-indigo-600 dark:hover:text-white">
              Student Sign In
            </Link>
            <Link to="/signup" className="hover:text-indigo-600 dark:hover:text-white">
              Create Account
            </Link>
            <button
              type="button"
              onClick={handleExploreDemo}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Instant Demo
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Created by a B.Tech Data Science student. Powered by Google Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
};
