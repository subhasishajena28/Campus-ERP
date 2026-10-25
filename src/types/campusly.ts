export type RecordVerificationStatus = 'verified' | 'unverified' | 'sample_data';

export interface SubjectRecord {
  id: string;
  semester: number;
  academicYear: string; // e.g. "2024-2025"
  subjectCode: string;
  subjectName: string;
  credits: number;
  marks: number; // 0-100
  grade: string; // "O", "A+", "A", "B+", "B", "C", "F"
  gradePoints: number; // 10, 9, 8, 7, 6, 5, 0
  status: RecordVerificationStatus;
  notes?: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  classesAttended: number;
  totalClasses: number;
  lastUpdated: string;
}

export type FeeStatus = 'paid' | 'pending' | 'partially_paid' | 'overdue';

export interface FeeRecord {
  id: string;
  receiptNumber: string;
  semester: number;
  academicYear: string;
  feeType: 'Tuition Fee' | 'Laboratory & Computing' | 'Library & Digital Resources' | 'Examination Fee' | 'Hostel & Amenities';
  assessedAmount: number;
  paidAmount: number;
  dueDate: string;
  paidDate?: string;
  status: FeeStatus;
  paymentMethod?: string;
  transactionRef?: string;
}

export type ProjectCategory = 'Machine Learning' | 'Data Science' | 'Web Development' | 'Mobile & Cloud' | 'Research';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  featured: boolean;
  completionDate: string; // "YYYY-MM"
  highlights?: string[];
}

export interface TimetableEvent {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  subjectCode: string;
  subjectName: string;
  room: string;
  instructor?: string;
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar';
}

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskType = 'assignment' | 'exam_prep' | 'project' | 'study_session';

export interface TaskItem {
  id: string;
  title: string;
  type: TaskType;
  priority: TaskPriority;
  dueDate: string;
  completed: boolean;
  subjectCode?: string;
  notes?: string;
}

export type NoticeCategory = 'Examinations' | 'Academic' | 'Events' | 'Deadlines' | 'Placement';

export interface CampusNotice {
  id: string;
  title: string;
  category: NoticeCategory;
  date: string;
  summary: string;
  fullContent: string;
  priority: 'urgent' | 'important' | 'normal';
  read: boolean;
  author: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  studentId: string; // Enrollment ID
  institutionName: string;
  degree: string;
  specialization: string;
  department: string;
  currentSemester: number;
  academicYear: string;
  graduationYear: number;
  email: string;
  phone?: string;
  city?: string;
  bio: string;
  skills: string[];
  avatarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  isDemoUser: boolean;
}

export interface AIStudyPlanSlot {
  day: string;
  timeSlot: string;
  subject: string;
  topic: string;
  activityType: 'Concept Review' | 'Problem Solving' | 'Lab Work' | 'Mock Quiz';
  durationMinutes: number;
  reason: string;
}

export interface AIStudyPlan {
  id: string;
  createdAt: string;
  title: string;
  targetHoursWeekly: number;
  examFocus: string;
  overview: string;
  slots: AIStudyPlanSlot[];
  guidanceTips: string[];
}
