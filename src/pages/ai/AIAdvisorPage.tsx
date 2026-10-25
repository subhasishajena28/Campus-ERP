import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  Calendar,
  TrendingUp,
  Brain,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  BarChart2,
  ChevronRight,
  Loader2,
  Zap,
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { exploreAttendanceGradePattern } from '../../utils/academicAnalytics';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isLiveAI?: boolean;
}

export const AIAdvisorPage: React.FC = () => {
  const {
    profile,
    subjects,
    attendance,
    tasks,
    cgpa,
    overallAttendance,
    subjectsNeedingAttention,
    semesterTrends,
    addTask,
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'chat' | 'planner' | 'intelligence' | 'remediation'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${profile.fullName.split(' ')[0]}! I am **Campus AI**, your academic copilot on CAMPUSLY.\n\nI have reviewed your 5th-semester Data Science records:\n- **Current CGPA**: ${cgpa.toFixed(2)} (Highest: Sem 2 at 8.63)\n- **Overall Attendance**: ${overallAttendance.percentage}%\n- **Alert**: Cloud Computing & DevOps attendance is at **70.0%**, which is below your institutional 75% threshold.\n\nHow can I help you today? You can ask me to analyze your grade progression, plan your weekly study revision, or review concepts!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLiveAI: false,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Study Planner State
  const [targetHours, setTargetHours] = useState<number>(18);
  const [examFocus, setExamFocus] = useState('Autumn Mid-Term Examinations (Nov 10)');
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [savedPlanToast, setSavedPlanToast] = useState(false);

  // Exploratory correlation pattern between attendance and grades
  const correlationData = useMemo(() => {
    return exploreAttendanceGradePattern(subjects, attendance);
  }, [subjects, attendance]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  // Handle Send Chat
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || chatLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const response = await fetch('/api/gemini/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          studentContext: {
            name: profile.fullName,
            degree: profile.degree,
            specialization: profile.specialization,
            semester: profile.currentSemester,
            cgpa: cgpa.toFixed(2),
            attendance: `${overallAttendance.percentage}%`,
            attentionSubjects: subjectsNeedingAttention.map((s) => `${s.subjectCode} (${s.reasons.join(', ')})`),
            tasks: tasks.filter((t) => !t.completed).map((t) => t.title),
          },
        }),
      });

      const data = await response.json();
      const aiReply: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'No response returned from model.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: data.isLiveAI,
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to reach the Gemini API endpoint. Please check your network or try again in a moment.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLiveAI: false,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Generate Personalized Study Plan
  const handleGenerateStudyPlan = async () => {
    setGeneratingPlan(true);
    setSavedPlanToast(false);

    try {
      const response = await fetch('/api/gemini/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjects: subjects.filter((s) => s.semester === profile.currentSemester),
          targetHoursWeekly: targetHours,
          examFocus,
          difficultSubjects: subjectsNeedingAttention.map((s) => s.subjectName),
        }),
      });

      const data = await response.json();
      setGeneratedPlan(data.plan || 'Study plan generated.');
    } catch (err: any) {
      setGeneratedPlan('Could not generate plan due to a temporary connection issue.');
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleSavePlanTasks = () => {
    addTask({
      title: 'Study Block: Cloud Computing & DevOps Containers Practice',
      type: 'study_session',
      priority: 'high',
      dueDate: '2026-10-30',
      completed: false,
      notes: 'Generated via Campus AI Personalized Planner',
    });
    addTask({
      title: 'Study Block: Transformer Attention PyTorch Review',
      type: 'study_session',
      priority: 'medium',
      dueDate: '2026-11-01',
      completed: false,
      notes: 'Generated via Campus AI Personalized Planner',
    });
    setSavedPlanToast(true);
    setTimeout(() => setSavedPlanToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-indigo-600 animate-pulse" />
            Campus AI — Academic Copilot & Intelligence Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Data-grounded learning assistance, personalized study roadmaps, and statistical analytics
          </p>
        </div>

        <Badge variant="primary" size="md">
          Model: Gemini 3.8 Flash
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'chat'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Bot className="w-4 h-4" />
          Interactive Copilot
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('planner')}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'planner'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Personalized Study Planner
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('remediation')}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'remediation'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Subject Improvement Strategy
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('intelligence')}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'intelligence'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          Academic Intelligence & Correlation
        </button>
      </div>

      {/* ---------------- TAB 1: Interactive Chat Copilot ---------------- */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chat Window (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col h-[600px] overflow-hidden">
            {/* Chat header */}
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Campus AI Academic Assistant
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Live session context injected • Strict academic integrity
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome_reset',
                      sender: 'assistant',
                      text: `Conversation restarted. How can I assist you with your Semester 5 coursework or portfolio?`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ])
                }
                className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1"
                title="Restart conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-3xl ${
                    m.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
                  }`}
                >
                  {m.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-4 space-y-1.5 shadow-xs ${
                      m.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="prose prose-xs dark:prose-invert max-w-none whitespace-pre-line leading-relaxed">
                      {m.text}
                    </div>
                    <div
                      className={`text-[10px] flex items-center justify-end gap-2 pt-1 ${
                        m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      {m.isLiveAI !== undefined && (
                        <span>{m.isLiveAI ? '• Gemini 3.8' : '• Engine Heuristics'}</span>
                      )}
                      <span>{m.timestamp}</span>
                    </div>
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {chatLoading && (
                <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Campus AI is analyzing your records...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about your SGPA trend, attendance recovery, or exam prep..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={chatLoading || !inputMessage.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 cursor-pointer"
                aria-label="Send query to Copilot"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick Prompts & Student Context Box (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Suggested Prompts
              </span>
              <div className="space-y-2">
                {[
                  'What classes must I attend to clear my 75% attendance criteria?',
                  'Analyze my Semester 1 to Semester 5 SGPA progression trend.',
                  'Suggest 3 study techniques for Big Data Technologies and Spark.',
                  'How can I improve my Student Performance Predictor GitHub README?',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputMessage(prompt);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-300 text-xs text-slate-700 dark:text-slate-300 transition-all flex items-center justify-between"
                  >
                    <span className="line-clamp-2">{prompt}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Active Student Context
              </span>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Student Name:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {profile.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Calculated CGPA:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {cgpa.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Aggregate Attendance:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {overallAttendance.percentage}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Flagged Course:</span>
                  <span className="font-semibold text-amber-600">CS301 (70% att)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: Personalized Study Planner ---------------- */}
      {activeTab === 'planner' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Automated Personalized Revision Planner
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Generates an optimized weekly schedule taking into account attendance recovery,
              difficult coursework, and upcoming assessment dates.
            </p>
          </div>

          {/* Configuration Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Weekly Target Study Commitment
              </label>
              <select
                value={targetHours}
                onChange={(e) => setTargetHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value={12}>12 Hours / week (Light / Consistent)</option>
                <option value={16}>16 Hours / week (Recommended Standard)</option>
                <option value={20}>20 Hours / week (Intensive Exam Prep)</option>
                <option value={25}>25 Hours / week (Crunch Mode)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Assessment Focus
              </label>
              <input
                type="text"
                value={examFocus}
                onChange={(e) => setExamFocus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleGenerateStudyPlan}
                disabled={generatingPlan}
                className="w-full py-2 px-4 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {generatingPlan ? 'Generating Plan...' : 'Generate AI Study Schedule'}
              </button>
            </div>
          </div>

          {/* Display Output */}
          {generatedPlan ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Generated Weekly Study Schedule
                </span>
                <div className="flex items-center gap-2">
                  {savedPlanToast && (
                    <span className="text-xs font-semibold text-emerald-600">
                      ✓ Study tasks added to your Task List!
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSavePlanTasks}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Save Tasks to Timetable
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 prose prose-sm dark:prose-invert max-w-none whitespace-pre-line text-xs leading-relaxed font-sans">
                {generatedPlan}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Brain className="w-8 h-8 text-indigo-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No study plan generated yet
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click "Generate AI Study Schedule" to create a structured day-by-day plan tailored
                specifically to your Semester 5 subjects.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ---------------- TAB 3: Subject Improvement Strategy ---------------- */}
      {activeTab === 'remediation' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Subject Diagnostic Radar</p>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                The Academic Copilot flags subjects having attendance &lt; 75% or scores under 70%,
                providing concrete corrective action without promising unverified exam grades.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjectsNeedingAttention.map((item) => (
              <div
                key={item.subjectCode}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {item.subjectName}
                    </span>
                    <p className="text-xs font-mono text-slate-500">{item.subjectCode} • Semester {item.semester}</p>
                  </div>
                  <Badge variant="warning" size="sm">
                    {item.severity === 'high' ? 'High Attention' : 'Moderate Focus'}
                  </Badge>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase text-slate-500">
                    Flagged Rationale:
                  </span>
                  {item.reasons.map((r, i) => (
                    <p key={i} className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5 font-medium">
                      • {r}
                    </p>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Recommended Remedial Strategy:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                    <li>Attend the upcoming 8 scheduled sessions consecutively.</li>
                    <li>Schedule two 60-minute practical containerization drills on weekends.</li>
                    <li>Solve the mid-term past-year question paper from 2024.</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TAB 4: Academic Intelligence & Correlation ---------------- */}
      {activeTab === 'intelligence' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-600" />
              Exploratory Data Science: Attendance & Grade Correlation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Statistical inquiry evaluating matched attendance percentages and course scores across your registered subjects.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Matched Subject Pairs: {correlationData.matchedCount}
              </span>
              <span className="font-mono font-bold text-indigo-600">
                Pearson r = {correlationData.pearsonR !== null ? correlationData.pearsonR : 'N/A'}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {correlationData.insight}
            </p>
          </div>

          {/* Matched Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Subject Name</th>
                  <th className="py-2.5 px-4 text-center">Attendance Logged (%)</th>
                  <th className="py-2.5 px-4 text-center">Assessment Score (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {correlationData.pairs.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {p.subjectName}
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                      {p.attendancePct}%
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {p.marks}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 text-[11px] text-slate-500">
            <strong>B.Tech Data Science Rigor:</strong> As an aspiring data scientist, recognizing that statistical correlation does not establish causation is essential. Confounding variables such as prior subject background, teaching pedagogy, and project complexity influence academic scores alongside attendance.
          </div>
        </div>
      )}
    </div>
  );
};
