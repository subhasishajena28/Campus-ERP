# CAMPUSLY — AI-Powered Student ERP & Academic Intelligence Platform

> *"Your academics. Your progress. Your future."*  
> *A smarter student experience powered by academic analytics and Gemini AI.*

CAMPUSLY is an enterprise-grade student ERP portal combining academic management, credit-weighted CGPA & SGPA analytics, attendance regulatory forecasting, fee ledgers with simulated settlement, student project portfolio showcase, and an applied Gemini AI Academic Copilot.

Designed and engineered by a third-year B.Tech Data Science student at Apex Institute of Technology & Science, CAMPUSLY bridges the gap between traditional college administrative portals and modern AI-augmented productivity platforms.

---

## 🚀 Key Features

### 1. Unified Academic Management & Record Ledger (`/app/academics`)
- **Credit-Weighted UGC Grading**: Automatic computation of Grade Points and UGC letter grades (O, A+, A, B+, B, C, P, F) from percentage marks.
- **Verification Integrity Distinction**: Explicit labeling of **Official / Sample Data** vs **Student-Entered (Unverified)** records, safeguarding against fabricated credentials.
- **Dynamic Recalculations**: Immediate real-time re-computation of semester SGPA and cumulative CGPA upon adding, editing, or deleting coursework records.

### 2. Deep Result & CGPA Analytics (`/app/results`)
- **Interactive Multi-Semester Trend Line**: Visualized using Recharts with tooltip deltas and credit-weighted trajectory tracking.
- **Transcript Summary CSV Export**: Instant one-click CSV report generator from the student's live records.
- **Printable Report View**: Formatted CSS print layouts for offline advising sessions.

### 3. Attendance Intelligence & Compliance Forecasting (`/app/attendance`)
- **Configurable Institutional Minimum Alert**: Interactive threshold slider (default 75%) with visual warning indicators.
- **Recovery Session Forecaster**: Mathematical algorithm calculating the exact number of consecutive classes required to restore compliant standing (e.g., attending next 8 sessions in Cloud Computing).
- **Session Attendance Simulator**: Sandbox tools to forecast the impact of missed or attended upcoming sessions.

### 4. Fee Management & Ledger Simulation (`/app/fees`)
- **INR (₹) Accounting**: Breakdown across Tuition, Laboratory & Computing, Examination, and Digital Library assessments.
- **Simulated Payment Gateway**: Safe sandbox simulation (UPI / Net Banking / Debit Card) updating records without exposing banking credentials.
- **Downloadable & Printable Demo Receipts**: Auto-generated receipts with prominent **"DEMO RECEIPT — NOT VALID FOR PAYMENT OR OFFICIAL USE"** watermark.

### 5. Student Engineering Portfolio Showcase (`/app/portfolio`)
- **Recruiter-Ready Projects Grid**: Showcasing machine learning models, analytical pipelines, GitHub repositories, and live deployed web applications.
- **Portfolio Completeness Meter**: Transparent 0-100% calculation evaluating bio, core skills, featured projects, repository links, and live demos.
- **Gemini Project Description Assistant**: Server-side AI assistant refining project overviews and bullet highlights using active engineering verbs without fabricating false metrics.
- **Public Recruiter Preview**: Modal view providing recruiters with an uncluttered review of student competencies.

### 6. Timetable & Milestone Task Tracker (`/app/timetable`)
- **Tri-Modal Calendar View**: Switch seamlessly between Weekly Grid, Daily Schedule, and Compact Table views.
- **Milestone Management**: Priority-coded tasks (High, Medium, Low) for assignment deadlines, exam prep, and study sessions.

### 7. Campus Announcements & Notice Board (`/app/notices`)
- Category-filtered circulars (Examinations, Academic, Events, Deadlines, Placement) with read/unread tracking connected to the top-bar notification bell.

### 8. Gemini AI Academic Copilot & Study Planner (`/app/ai-advisor`)
- **Campus AI Interactive Chat**: Grounded in the student's actual enrolled courses, SGPA progression, and attendance flags.
- **Personalized Weekly Study Planner**: Generates structured, hour-by-hour revision schedules balanced around priority subjects and exam deadlines, with direct "Save to Tasks" integration.
- **Exploratory Data Science Correlation**: Computes Pearson *r* between class attendance and course marks, explicitly contextualizing that correlation does not imply causation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS v4 |
| **Visualizations** | Recharts (Responsive Line, Bar, and Area charts) |
| **Icons** | Lucide React |
| **Backend & Server** | Node.js, Express, TSX |
| **AI Integration** | Google Gemini API (`@google/genai` SDK with `gemini-3.8-flash`) |
| **State Management** | React Context API with LocalStorage Synchronization |
| **Testing** | Node built-in test runner (`node:test`, `node:assert/strict`) |

---

## 🏛️ System Architecture

```
                  +----------------------------------------------+
                  |                 Client (SPA)                 |
                  |     React 19 + TypeScript + Tailwind CSS     |
                  +-----------------------+----------------------+
                                          |
                      REST API Calls      |   Client-side Route Isolation
                                          v
                  +----------------------------------------------+
                  |            Express Backend Server            |
                  |                  (server.ts)                 |
                  +-------+------------------------------+-------+
                          |                              |
                          v                              v
                +-------------------+          +-------------------+
                | Google Gemini API |          |  Vite Middleware  |
                | (gemini-3.8-flash)|          |   (Dev Server)    |
                +-------------------+          +-------------------+
```

---

## 💾 Data Model Entities

```typescript
// Core Entities in src/types/campusly.ts
StudentProfile { id, fullName, studentId, institutionName, degree, specialization, currentSemester, cgpa, skills }
SubjectRecord { id, semester, subjectCode, subjectName, credits, marks, grade, gradePoints, status: 'verified' | 'unverified' | 'sample_data' }
AttendanceRecord { id, subjectCode, subjectName, semester, classesAttended, totalClasses, lastUpdated }
FeeRecord { id, receiptNumber, semester, feeType, assessedAmount, paidAmount, status, dueDate, transactionRef }
Project { id, title, category, shortDescription, fullDescription, technologies, githubUrl, liveDemoUrl, featured }
TimetableEvent { id, dayOfWeek, startTime, endTime, subjectCode, subjectName, room, instructor, type }
TaskItem { id, title, type, priority, dueDate, completed, notes }
CampusNotice { id, title, category, date, summary, fullContent, priority, read }
```

---

## 💻 Local Setup & Development

### Prerequisites
- Node.js >= 18.x
- npm or bun

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd campusly
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `GEMINI_API_KEY` is configured in your environment or Google AI Studio secrets.

### 3. Run Unit Tests (Pure Logic Verification)
```bash
npx --yes tsx --test src/utils/academicAnalytics.test.ts
```

### 4. Start Full-Stack Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000` with both Express API endpoints (`/api/gemini/*`) and Vite SPA frontend.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🔒 Security & Academic Integrity
- **Server-Side AI Secrets**: The `GEMINI_API_KEY` is accessed strictly in Node.js server runtime (`server.ts`) and is never sent to the browser bundle.
- **Verification Boundaries**: Manually input grades and scores are permanently tagged `Unverified` to maintain academic transparency.
- **Safe External Navigation**: All portfolio GitHub links and live demos utilize secure `target="_blank" rel="noopener noreferrer"` attributes.
- **Independent Prototype**: CAMPUSLY is a demonstration student ERP portfolio prototype and does not represent an official university registration system.

---

*Authored by Aarav Mehta, B.Tech Data Science & AI Class of 2028.*
