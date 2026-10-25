import { SubjectRecord, AttendanceRecord, StudentProfile, Project } from '../types/campusly';

/**
 * Maps percentage marks (0-100) to UGC 10-point scale grade and grade points.
 */
export function marksToGrade(marks: number): { grade: string; gradePoints: number } {
  const m = Math.max(0, Math.min(100, Math.round(marks)));
  if (m >= 90) return { grade: 'O', gradePoints: 10 };
  if (m >= 80) return { grade: 'A+', gradePoints: 9 };
  if (m >= 70) return { grade: 'A', gradePoints: 8 };
  if (m >= 60) return { grade: 'B+', gradePoints: 7 };
  if (m >= 55) return { grade: 'B', gradePoints: 6 };
  if (m >= 50) return { grade: 'C', gradePoints: 5 };
  if (m >= 40) return { grade: 'P', gradePoints: 4 };
  return { grade: 'F', gradePoints: 0 };
}

/**
 * Calculates Semester Grade Point Average (SGPA) for a given semester.
 * Returns null if no subjects or 0 credits exist for that semester.
 */
export function calculateSGPA(records: SubjectRecord[], semester: number): number | null {
  const semRecords = records.filter((r) => r.semester === semester);
  if (semRecords.length === 0) return null;

  const totalCredits = semRecords.reduce((acc, r) => acc + (r.credits || 0), 0);
  if (totalCredits === 0) return 0;

  const weightedPoints = semRecords.reduce((acc, r) => {
    return acc + (r.credits || 0) * (r.gradePoints ?? 0);
  }, 0);

  return Number((weightedPoints / totalCredits).toFixed(2));
}

/**
 * Calculates Cumulative Grade Point Average (CGPA) across all subject records.
 */
export function calculateCGPA(records: SubjectRecord[]): number {
  if (!records || records.length === 0) return 0;

  const totalCredits = records.reduce((acc, r) => acc + (r.credits || 0), 0);
  if (totalCredits === 0) return 0;

  const weightedPoints = records.reduce((acc, r) => {
    return acc + (r.credits || 0) * (r.gradePoints ?? 0);
  }, 0);

  return Number((weightedPoints / totalCredits).toFixed(2));
}

export interface SemesterTrend {
  semester: number;
  semesterLabel: string;
  sgpa: number;
  totalCredits: number;
  subjectCount: number;
  deltaFromPrevious: number | null;
}

/**
 * Computes semester-wise trend line data for Recharts.
 */
export function calculateSemesterTrends(records: SubjectRecord[]): SemesterTrend[] {
  if (!records || records.length === 0) return [];

  const semesters = Array.from(new Set(records.map((r) => r.semester))).sort((a, b) => a - b);
  const trends: SemesterTrend[] = [];

  for (let i = 0; i < semesters.length; i++) {
    const sem = semesters[i];
    const semRecords = records.filter((r) => r.semester === sem);
    const sgpa = calculateSGPA(records, sem) || 0;
    const totalCredits = semRecords.reduce((acc, r) => acc + (r.credits || 0), 0);
    const prevTrend = trends[i - 1];
    const delta = prevTrend ? Number((sgpa - prevTrend.sgpa).toFixed(2)) : null;

    trends.push({
      semester: sem,
      semesterLabel: `Sem ${sem}`,
      sgpa,
      totalCredits,
      subjectCount: semRecords.length,
      deltaFromPrevious: delta,
    });
  }

  return trends;
}

/**
 * Calculates overall attendance percentage across all attendance records.
 */
export function calculateOverallAttendance(records: AttendanceRecord[]): {
  percentage: number;
  attended: number;
  total: number;
  missed: number;
} {
  if (!records || records.length === 0) {
    return { percentage: 0, attended: 0, total: 0, missed: 0 };
  }

  const attended = records.reduce((acc, r) => acc + r.classesAttended, 0);
  const total = records.reduce((acc, r) => acc + r.totalClasses, 0);
  const missed = Math.max(0, total - attended);
  const percentage = total > 0 ? Number(((attended / total) * 100).toFixed(1)) : 0;

  return { percentage, attended, total, missed };
}

export interface SubjectAttentionItem {
  subjectCode: string;
  subjectName: string;
  semester: number;
  marks?: number;
  grade?: string;
  gradePoints?: number;
  attendancePercentage?: number;
  attendedClasses?: number;
  totalClasses?: number;
  reasons: string[];
  severity: 'high' | 'medium';
}

/**
 * Identifies subjects needing academic or attendance attention.
 * Triggers if:
 * - Attendance < threshold (default 75%)
 * - Marks < 60 or Grade Points <= 6
 */
export function getSubjectsNeedingAttention(
  academicRecords: SubjectRecord[],
  attendanceRecords: AttendanceRecord[],
  threshold = 75
): SubjectAttentionItem[] {
  const map = new Map<string, SubjectAttentionItem>();

  for (const sub of academicRecords) {
    const isAcademicConcern = (sub.marks !== undefined && sub.marks < 65) || (sub.gradePoints !== undefined && sub.gradePoints <= 6);
    if (isAcademicConcern) {
      const reasons: string[] = [];
      if (sub.marks < 50) {
        reasons.push(`Score of ${sub.marks}% is near passing boundary`);
      } else {
        reasons.push(`Current score of ${sub.marks}% (Grade ${sub.grade}) has room for improvement`);
      }

      map.set(sub.subjectCode, {
        subjectCode: sub.subjectCode,
        subjectName: sub.subjectName,
        semester: sub.semester,
        marks: sub.marks,
        grade: sub.grade,
        gradePoints: sub.gradePoints,
        reasons,
        severity: sub.marks < 50 ? 'high' : 'medium',
      });
    }
  }

  for (const att of attendanceRecords) {
    const pct = att.totalClasses > 0 ? Number(((att.classesAttended / att.totalClasses) * 100).toFixed(1)) : 100;
    if (pct < threshold) {
      const existing = map.get(att.subjectCode);
      const attReason = `Attendance is ${pct}%, below institution threshold (${threshold}%)`;
      if (existing) {
        existing.attendancePercentage = pct;
        existing.attendedClasses = att.classesAttended;
        existing.totalClasses = att.totalClasses;
        existing.reasons.push(attReason);
        existing.severity = 'high';
      } else {
        map.set(att.subjectCode, {
          subjectCode: att.subjectCode,
          subjectName: att.subjectName,
          semester: att.semester,
          attendancePercentage: pct,
          attendedClasses: att.classesAttended,
          totalClasses: att.totalClasses,
          reasons: [attReason],
          severity: pct < 65 ? 'high' : 'medium',
        });
      }
    } else {
      const existing = map.get(att.subjectCode);
      if (existing) {
        existing.attendancePercentage = pct;
        existing.attendedClasses = att.classesAttended;
        existing.totalClasses = att.totalClasses;
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => (a.severity === 'high' ? -1 : 1));
}

/**
 * Calculates transparent portfolio completeness score (0-100%).
 */
export function calculatePortfolioCompleteness(
  profile?: Partial<StudentProfile>,
  projects?: Project[]
): {
  score: number;
  breakdown: { label: string; score: number; maxScore: number; achieved: boolean }[];
} {
  const breakdown = [
    {
      label: 'Profile Bio & Header',
      score: Boolean(profile?.bio && profile.bio.length >= 30) ? 15 : 0,
      maxScore: 15,
      achieved: Boolean(profile?.bio && profile.bio.length >= 30),
    },
    {
      label: 'Core Technical Skills (at least 5)',
      score: Boolean(profile?.skills && profile.skills.length >= 5) ? 20 : Math.min(20, (profile?.skills?.length || 0) * 4),
      maxScore: 20,
      achieved: Boolean(profile?.skills && profile.skills.length >= 5),
    },
    {
      label: 'Featured Projects (at least 2)',
      score: Boolean(projects && projects.length >= 2) ? 25 : (projects?.length || 0) * 12.5,
      maxScore: 25,
      achieved: Boolean(projects && projects.length >= 2),
    },
    {
      label: 'Repository Links on Projects',
      score: Boolean(projects && projects.some((p) => Boolean(p.githubUrl))) ? 15 : 0,
      maxScore: 15,
      achieved: Boolean(projects && projects.some((p) => Boolean(p.githubUrl))),
    },
    {
      label: 'Live Demos or Deployed Apps',
      score: Boolean(projects && projects.some((p) => Boolean(p.liveDemoUrl))) ? 15 : 0,
      maxScore: 15,
      achieved: Boolean(projects && projects.some((p) => Boolean(p.liveDemoUrl))),
    },
    {
      label: 'Professional Social Profiles (GitHub / LinkedIn)',
      score: Boolean(profile?.githubUrl || profile?.linkedinUrl) ? 10 : 0,
      maxScore: 10,
      achieved: Boolean(profile?.githubUrl || profile?.linkedinUrl),
    },
  ];

  const totalScore = Math.min(100, breakdown.reduce((acc, item) => acc + item.score, 0));
  return { score: Math.round(totalScore), breakdown };
}

/**
 * Exploratory correlation between attendance percentage and marks for matched subjects.
 * Calculates Pearson r. Strictly highlights that correlation does not imply causation.
 */
export function exploreAttendanceGradePattern(
  records: SubjectRecord[],
  attendance: AttendanceRecord[]
): {
  matchedCount: number;
  pairs: { subjectName: string; attendancePct: number; marks: number }[];
  pearsonR: number | null;
  insight: string;
} {
  const attMap = new Map<string, number>();
  for (const a of attendance) {
    if (a.totalClasses > 0) {
      const pct = (a.classesAttended / a.totalClasses) * 100;
      attMap.set(a.subjectCode, Number(pct.toFixed(1)));
    }
  }

  const pairs: { subjectName: string; attendancePct: number; marks: number }[] = [];
  for (const r of records) {
    const att = attMap.get(r.subjectCode);
    if (att !== undefined && r.marks !== undefined) {
      pairs.push({
        subjectName: r.subjectName,
        attendancePct: att,
        marks: r.marks,
      });
    }
  }

  if (pairs.length < 3) {
    return {
      matchedCount: pairs.length,
      pairs,
      pearsonR: null,
      insight: 'Insufficient matched subject pairs (<3) to compute statistical correlation.',
    };
  }

  const n = pairs.length;
  const x = pairs.map((p) => p.attendancePct);
  const y = pairs.map((p) => p.marks);

  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  const denominator = Math.sqrt(denomX * denomY);
  const r = denominator === 0 ? 0 : Number((numerator / denominator).toFixed(3));

  let correlationLabel = 'weak / negligible';
  if (r > 0.6) correlationLabel = 'moderate to strong positive association';
  else if (r > 0.3) correlationLabel = 'mild positive association';
  else if (r < -0.3) correlationLabel = 'negative association';

  const insight = `Pearson r = ${r} (${correlationLabel}). Note: In academic data science, exploratory correlation highlights co-occurrence and does not establish that attendance directly causes grade differences.`;

  return {
    matchedCount: n,
    pairs,
    pearsonR: r,
    insight,
  };
}
