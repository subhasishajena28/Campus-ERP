import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  StudentProfile,
  SubjectRecord,
  AttendanceRecord,
  FeeRecord,
  Project,
  TimetableEvent,
  TaskItem,
  CampusNotice,
  AIStudyPlan,
} from '../types/campusly';
import {
  SEED_PROFILE,
  SEED_SUBJECTS,
  SEED_ATTENDANCE,
  SEED_FEES,
  SEED_PROJECTS,
  SEED_TIMETABLE,
  SEED_TASKS,
  SEED_NOTICES,
} from '../data/seedData';
import {
  calculateCGPA,
  calculateOverallAttendance,
  getSubjectsNeedingAttention,
  calculateSemesterTrends,
  calculatePortfolioCompleteness,
  marksToGrade,
} from '../utils/academicAnalytics';

interface CampusContextType {
  profile: StudentProfile;
  subjects: SubjectRecord[];
  attendance: AttendanceRecord[];
  fees: FeeRecord[];
  projects: Project[];
  timetable: TimetableEvent[];
  tasks: TaskItem[];
  notices: CampusNotice[];
  savedStudyPlans: AIStudyPlan[];
  theme: 'light' | 'dark';
  isDemoMode: boolean;
  minAttendanceThreshold: number;
  isAuthenticated: boolean;

  // Analytics derived values
  cgpa: number;
  overallAttendance: { percentage: number; attended: number; total: number; missed: number };
  subjectsNeedingAttention: ReturnType<typeof getSubjectsNeedingAttention>;
  semesterTrends: ReturnType<typeof calculateSemesterTrends>;
  portfolioCompleteness: ReturnType<typeof calculatePortfolioCompleteness>;
  totalFeeAssessed: number;
  totalFeePaid: number;
  feeBalance: number;
  unreadNoticesCount: number;

  // Actions
  updateProfile: (updates: Partial<StudentProfile>) => void;
  addSubject: (subject: Omit<SubjectRecord, 'id' | 'updatedAt' | 'grade' | 'gradePoints'> & { marks: number }) => void;
  updateSubject: (id: string, updates: Partial<SubjectRecord>) => void;
  deleteSubject: (id: string) => void;
  updateAttendance: (id: string, classesAttended: number, totalClasses: number) => void;
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id' | 'lastUpdated'>) => void;
  payFeeSimulation: (id: string, amount: number, method: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addTimetableEvent: (event: Omit<TimetableEvent, 'id'>) => void;
  deleteTimetableEvent: (id: string) => void;
  addTask: (task: Omit<TaskItem, 'id'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  markNoticeRead: (id: string) => void;
  markAllNoticesRead: () => void;
  saveStudyPlan: (plan: AIStudyPlan) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setMinAttendanceThreshold: (threshold: number) => void;
  resetToDemoData: () => void;
  loginAsDemo: () => void;
  loginWithEmail: (email: string, name?: string) => void;
  logout: () => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'campusly_profile',
  SUBJECTS: 'campusly_subjects',
  ATTENDANCE: 'campusly_attendance',
  FEES: 'campusly_fees',
  PROJECTS: 'campusly_projects',
  TIMETABLE: 'campusly_timetable',
  TASKS: 'campusly_tasks',
  NOTICES: 'campusly_notices',
  PLANS: 'campusly_plans',
  THEME: 'campusly_theme',
  THRESHOLD: 'campusly_threshold',
  AUTH: 'campusly_auth',
};

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : SEED_PROFILE;
  });

  const [subjects, setSubjectsState] = useState<SubjectRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return saved ? JSON.parse(saved) : SEED_SUBJECTS;
  });

  const [attendance, setAttendanceState] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : SEED_ATTENDANCE;
  });

  const [fees, setFeesState] = useState<FeeRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FEES);
    return saved ? JSON.parse(saved) : SEED_FEES;
  });

  const [projects, setProjectsState] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : SEED_PROJECTS;
  });

  const [timetable, setTimetableState] = useState<TimetableEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
    return saved ? JSON.parse(saved) : SEED_TIMETABLE;
  });

  const [tasks, setTasksState] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : SEED_TASKS;
  });

  const [notices, setNoticesState] = useState<CampusNotice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
    return saved ? JSON.parse(saved) : SEED_NOTICES;
  });

  const [savedStudyPlans, setSavedStudyPlansState] = useState<AIStudyPlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [minAttendanceThreshold, setMinAttendanceThresholdState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THRESHOLD);
    return saved ? Number(saved) : 75;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? JSON.parse(saved).authenticated : true; // default demo authenticated
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(savedStudyPlans));
  }, [savedStudyPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THRESHOLD, String(minAttendanceThreshold));
  }, [minAttendanceThreshold]);

  // Derived Analytics Values
  const cgpa = useMemo(() => calculateCGPA(subjects), [subjects]);

  const overallAttendance = useMemo(() => calculateOverallAttendance(attendance), [attendance]);

  const subjectsNeedingAttention = useMemo(
    () => getSubjectsNeedingAttention(subjects, attendance, minAttendanceThreshold),
    [subjects, attendance, minAttendanceThreshold]
  );

  const semesterTrends = useMemo(() => calculateSemesterTrends(subjects), [subjects]);

  const portfolioCompleteness = useMemo(
    () => calculatePortfolioCompleteness(profile, projects),
    [profile, projects]
  );

  const totalFeeAssessed = useMemo(() => fees.reduce((acc, f) => acc + f.assessedAmount, 0), [fees]);
  const totalFeePaid = useMemo(() => fees.reduce((acc, f) => acc + f.paidAmount, 0), [fees]);
  const feeBalance = Math.max(0, totalFeeAssessed - totalFeePaid);

  const unreadNoticesCount = useMemo(() => notices.filter((n) => !n.read).length, [notices]);

  // Actions
  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfileState((prev) => ({ ...prev, ...updates }));
  };

  const addSubject = (
    data: Omit<SubjectRecord, 'id' | 'updatedAt' | 'grade' | 'gradePoints'> & { marks: number }
  ) => {
    const { grade, gradePoints } = marksToGrade(data.marks);
    const newRecord: SubjectRecord = {
      ...data,
      id: `sub_${Date.now()}`,
      grade,
      gradePoints,
      status: 'unverified',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setSubjectsState((prev) => [newRecord, ...prev]);
  };

  const updateSubject = (id: string, updates: Partial<SubjectRecord>) => {
    setSubjectsState((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        let grade = s.grade;
        let gradePoints = s.gradePoints;
        if (updates.marks !== undefined) {
          const res = marksToGrade(updates.marks);
          grade = res.grade;
          gradePoints = res.gradePoints;
        }
        return {
          ...s,
          ...updates,
          grade,
          gradePoints,
          status: 'unverified',
          updatedAt: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  const deleteSubject = (id: string) => {
    setSubjectsState((prev) => prev.filter((s) => s.id !== id));
  };

  const updateAttendance = (id: string, classesAttended: number, totalClasses: number) => {
    setAttendanceState((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              classesAttended: Math.min(totalClasses, Math.max(0, classesAttended)),
              totalClasses: Math.max(1, totalClasses),
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : a
      )
    );
  };

  const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id' | 'lastUpdated'>) => {
    const newAtt: AttendanceRecord = {
      ...record,
      id: `att_${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setAttendanceState((prev) => [newAtt, ...prev]);
  };

  const payFeeSimulation = (id: string, amount: number, method: string) => {
    setFeesState((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const newPaid = Math.min(f.assessedAmount, f.paidAmount + amount);
        const status = newPaid >= f.assessedAmount ? 'paid' : 'partially_paid';
        return {
          ...f,
          paidAmount: newPaid,
          status,
          paymentMethod: method,
          paidDate: new Date().toISOString().split('T')[0],
          transactionRef: `SIM/${Date.now().toString().slice(-6)}`,
        };
      })
    );
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...project,
      id: `proj_${Date.now()}`,
    };
    setProjectsState((prev) => [newProj, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjectsState((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProject = (id: string) => {
    setProjectsState((prev) => prev.filter((p) => p.id !== id));
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || profile.skills.includes(trimmed)) return;
    setProfileState((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
  };

  const removeSkill = (skill: string) => {
    setProfileState((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addTimetableEvent = (event: Omit<TimetableEvent, 'id'>) => {
    const newEv: TimetableEvent = {
      ...event,
      id: `tt_${Date.now()}`,
    };
    setTimetableState((prev) => [...prev, newEv]);
  };

  const deleteTimetableEvent = (id: string) => {
    setTimetableState((prev) => prev.filter((e) => e.id !== id));
  };

  const addTask = (task: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...task,
      id: `task_${Date.now()}`,
    };
    setTasksState((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasksState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasksState((prev) => prev.filter((t) => t.id !== id));
  };

  const markNoticeRead = (id: string) => {
    setNoticesState((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNoticesRead = () => {
    setNoticesState((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const saveStudyPlan = (plan: AIStudyPlan) => {
    setSavedStudyPlansState((prev) => [plan, ...prev]);
  };

  const resetToDemoData = () => {
    setProfileState(SEED_PROFILE);
    setSubjectsState(SEED_SUBJECTS);
    setAttendanceState(SEED_ATTENDANCE);
    setFeesState(SEED_FEES);
    setProjectsState(SEED_PROJECTS);
    setTimetableState(SEED_TIMETABLE);
    setTasksState(SEED_TASKS);
    setNoticesState(SEED_NOTICES);
    setSavedStudyPlansState([]);
    localStorage.clear();
  };

  const loginAsDemo = () => {
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ authenticated: true, isDemo: true }));
  };

  const loginWithEmail = (email: string, name?: string) => {
    setIsAuthenticated(true);
    if (name) {
      setProfileState((prev) => ({ ...prev, fullName: name, email, isDemoUser: false }));
    }
    localStorage.setItem(
      STORAGE_KEYS.AUTH,
      JSON.stringify({ authenticated: true, email, isDemo: false })
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ authenticated: false }));
  };

  return (
    <CampusContext.Provider
      value={{
        profile,
        subjects,
        attendance,
        fees,
        projects,
        timetable,
        tasks,
        notices,
        savedStudyPlans,
        theme,
        isDemoMode: profile.isDemoUser,
        minAttendanceThreshold,
        isAuthenticated,
        cgpa,
        overallAttendance,
        subjectsNeedingAttention,
        semesterTrends,
        portfolioCompleteness,
        totalFeeAssessed,
        totalFeePaid,
        feeBalance,
        unreadNoticesCount,
        updateProfile,
        addSubject,
        updateSubject,
        deleteSubject,
        updateAttendance,
        addAttendanceRecord,
        payFeeSimulation,
        addProject,
        updateProject,
        deleteProject,
        addSkill,
        removeSkill,
        addTimetableEvent,
        deleteTimetableEvent,
        addTask,
        toggleTask,
        deleteTask,
        markNoticeRead,
        markAllNoticesRead,
        saveStudyPlan,
        setTheme: setThemeState,
        setMinAttendanceThreshold: setMinAttendanceThresholdState,
        resetToDemoData,
        loginAsDemo,
        loginWithEmail,
        logout,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = (): CampusContextType => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};
