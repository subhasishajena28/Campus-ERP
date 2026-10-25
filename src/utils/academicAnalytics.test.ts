import test from 'node:test';
import assert from 'node:assert/strict';
import {
  marksToGrade,
  calculateSGPA,
  calculateCGPA,
  calculateOverallAttendance,
  getSubjectsNeedingAttention,
  calculatePortfolioCompleteness,
  exploreAttendanceGradePattern,
} from './academicAnalytics';
import { SubjectRecord, AttendanceRecord, Project, StudentProfile } from '../types/campusly';

test('marksToGrade correctly maps percentage to grades and points', () => {
  assert.deepEqual(marksToGrade(95), { grade: 'O', gradePoints: 10 });
  assert.deepEqual(marksToGrade(82), { grade: 'A+', gradePoints: 9 });
  assert.deepEqual(marksToGrade(74), { grade: 'A', gradePoints: 8 });
  assert.deepEqual(marksToGrade(62), { grade: 'B+', gradePoints: 7 });
  assert.deepEqual(marksToGrade(55), { grade: 'B', gradePoints: 6 });
  assert.deepEqual(marksToGrade(35), { grade: 'F', gradePoints: 0 });
});

test('calculateSGPA accurately computes credit-weighted GPA', () => {
  const records: SubjectRecord[] = [
    {
      id: '1',
      semester: 1,
      academicYear: '2023-2024',
      subjectCode: 'CS101',
      subjectName: 'Intro to CS',
      credits: 4,
      marks: 85,
      grade: 'A+',
      gradePoints: 9,
      status: 'verified',
      updatedAt: '2023-12-01',
    },
    {
      id: '2',
      semester: 1,
      academicYear: '2023-2024',
      subjectCode: 'MA101',
      subjectName: 'Calculus',
      credits: 4,
      marks: 75,
      grade: 'A',
      gradePoints: 8,
      status: 'verified',
      updatedAt: '2023-12-01',
    },
    {
      id: '3',
      semester: 2,
      academicYear: '2023-2024',
      subjectCode: 'CS102',
      subjectName: 'Data Structures',
      credits: 4,
      marks: 92,
      grade: 'O',
      gradePoints: 10,
      status: 'verified',
      updatedAt: '2024-05-01',
    },
  ];

  // Semester 1: (4*9 + 4*8) / 8 = (36 + 32) / 8 = 68 / 8 = 8.5
  const sem1SGPA = calculateSGPA(records, 1);
  assert.equal(sem1SGPA, 8.5);

  // Semester 2: (4*10) / 4 = 10
  const sem2SGPA = calculateSGPA(records, 2);
  assert.equal(sem2SGPA, 10.0);

  // Semester 3: missing
  assert.equal(calculateSGPA(records, 3), null);
});

test('calculateCGPA computes cumulative weighted GPA across all semesters', () => {
  const records: SubjectRecord[] = [
    {
      id: '1',
      semester: 1,
      academicYear: '2023-2024',
      subjectCode: 'CS101',
      subjectName: 'Intro to CS',
      credits: 4,
      marks: 85,
      grade: 'A+',
      gradePoints: 9,
      status: 'verified',
      updatedAt: '2023-12-01',
    },
    {
      id: '2',
      semester: 1,
      academicYear: '2023-2024',
      subjectCode: 'MA101',
      subjectName: 'Calculus',
      credits: 4,
      marks: 75,
      grade: 'A',
      gradePoints: 8,
      status: 'verified',
      updatedAt: '2023-12-01',
    },
    {
      id: '3',
      semester: 2,
      academicYear: '2023-2024',
      subjectCode: 'CS102',
      subjectName: 'Data Structures',
      credits: 4,
      marks: 92,
      grade: 'O',
      gradePoints: 10,
      status: 'verified',
      updatedAt: '2024-05-01',
    },
  ];

  // Total points = 36 + 32 + 40 = 108; Total credits = 12; CGPA = 108 / 12 = 9.0
  assert.equal(calculateCGPA(records), 9.0);
});

test('calculateOverallAttendance computes accurate attendance percentage and missed counts', () => {
  const attendance: AttendanceRecord[] = [
    {
      id: 'a1',
      subjectCode: 'CS101',
      subjectName: 'Intro to CS',
      semester: 1,
      classesAttended: 36,
      totalClasses: 40,
      lastUpdated: '2024-05-01',
    },
    {
      id: 'a2',
      subjectCode: 'MA101',
      subjectName: 'Calculus',
      semester: 1,
      classesAttended: 24,
      totalClasses: 30,
      lastUpdated: '2024-05-01',
    },
  ];

  // Total attended = 60; Total = 70; Percentage = 60/70 = 85.7%
  const result = calculateOverallAttendance(attendance);
  assert.equal(result.attended, 60);
  assert.equal(result.total, 70);
  assert.equal(result.missed, 10);
  assert.equal(result.percentage, 85.7);
});

test('getSubjectsNeedingAttention flags subjects below attendance threshold or low marks', () => {
  const subjects: SubjectRecord[] = [
    {
      id: '1',
      semester: 1,
      academicYear: '2024-2025',
      subjectCode: 'DS301',
      subjectName: 'Probability & Statistics',
      credits: 4,
      marks: 58,
      grade: 'B',
      gradePoints: 6,
      status: 'verified',
      updatedAt: '2024-05-01',
    },
  ];

  const attendance: AttendanceRecord[] = [
    {
      id: 'a1',
      subjectCode: 'DS301',
      subjectName: 'Probability & Statistics',
      semester: 1,
      classesAttended: 20,
      totalClasses: 32, // 62.5% < 75%
      lastUpdated: '2024-05-01',
    },
  ];

  const flagged = getSubjectsNeedingAttention(subjects, attendance, 75);
  assert.equal(flagged.length, 1);
  assert.equal(flagged[0].subjectCode, 'DS301');
  assert.equal(flagged[0].severity, 'high');
  assert.equal(flagged[0].reasons.length, 2);
});

test('calculatePortfolioCompleteness computes transparent scores based on components', () => {
  const profile: Partial<StudentProfile> = {
    bio: 'Passionate B.Tech Data Science student focused on machine learning and intelligent applications.',
    skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'React'],
    githubUrl: 'https://github.com/aaravmehta',
    linkedinUrl: 'https://linkedin.com/in/aaravmehta',
  };

  const projects: Project[] = [
    {
      id: 'p1',
      title: 'Student Performance Analysis',
      category: 'Data Science',
      shortDescription: 'Exploratory data analysis of academic factors.',
      fullDescription: 'Comprehensive machine learning analysis of educational demographics.',
      technologies: ['Python', 'Pandas'],
      githubUrl: 'https://github.com/example/student-perf',
      liveDemoUrl: 'https://demo.example.com',
      featured: true,
      completionDate: '2024-08',
    },
    {
      id: 'p2',
      title: 'Bank Marketing Prediction',
      category: 'Machine Learning',
      shortDescription: 'Predictive modeling for term deposits.',
      fullDescription: 'Classification models comparing XGBoost and Random Forest.',
      technologies: ['Scikit-learn', 'Flask'],
      githubUrl: 'https://github.com/example/bank-marketing',
      featured: true,
      completionDate: '2024-10',
    },
  ];

  const { score, breakdown } = calculatePortfolioCompleteness(profile, projects);
  assert.equal(score, 100);
  assert.equal(breakdown.every((b) => b.achieved), true);
});

test('exploreAttendanceGradePattern computes Pearson r when >= 3 matched pairs exist', () => {
  const records: SubjectRecord[] = [
    { id: '1', semester: 1, academicYear: '2024-2025', subjectCode: 'S1', subjectName: 'Subject 1', credits: 4, marks: 90, grade: 'O', gradePoints: 10, status: 'verified', updatedAt: '' },
    { id: '2', semester: 1, academicYear: '2024-2025', subjectCode: 'S2', subjectName: 'Subject 2', credits: 4, marks: 80, grade: 'A+', gradePoints: 9, status: 'verified', updatedAt: '' },
    { id: '3', semester: 1, academicYear: '2024-2025', subjectCode: 'S3', subjectName: 'Subject 3', credits: 4, marks: 60, grade: 'B+', gradePoints: 7, status: 'verified', updatedAt: '' },
  ];

  const attendance: AttendanceRecord[] = [
    { id: 'a1', subjectCode: 'S1', subjectName: 'Subject 1', semester: 1, classesAttended: 38, totalClasses: 40, lastUpdated: '' }, // 95%
    { id: 'a2', subjectCode: 'S2', subjectName: 'Subject 2', semester: 1, classesAttended: 34, totalClasses: 40, lastUpdated: '' }, // 85%
    { id: 'a3', subjectCode: 'S3', subjectName: 'Subject 3', semester: 1, classesAttended: 28, totalClasses: 40, lastUpdated: '' }, // 70%
  ];

  const pattern = exploreAttendanceGradePattern(records, attendance);
  assert.equal(pattern.matchedCount, 3);
  assert.ok(pattern.pearsonR !== null);
  assert.ok(pattern.pearsonR! > 0.9); // strong positive correlation between 95,85,70 and 90,80,60
});
