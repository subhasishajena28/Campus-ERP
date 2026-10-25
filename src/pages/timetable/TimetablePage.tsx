import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  Trash2,
  List,
  Calendar as CalendarIcon,
  Columns,
  BookOpen,
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { TimetableEvent, TaskItem, TaskPriority, TaskType } from '../../types/campusly';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const TimetablePage: React.FC = () => {
  const {
    timetable,
    tasks,
    addTimetableEvent,
    deleteTimetableEvent,
    addTask,
    toggleTask,
    deleteTask,
  } = useCampus();

  const [activeView, setActiveView] = useState<'weekly' | 'daily' | 'compact'>('weekly');
  const [selectedDay, setSelectedDay] = useState<
    'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  >('Monday');

  // Modals
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  // Event Form
  const [dayOfWeek, setDayOfWeek] = useState<TimetableEvent['dayOfWeek']>('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:15');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [room, setRoom] = useState('Hall B-204');
  const [instructor, setInstructor] = useState('');
  const [eventType, setEventType] = useState<TimetableEvent['type']>('Lecture');
  const [eventError, setEventError] = useState('');

  // Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('assignment');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskDueDate, setTaskDueDate] = useState('2026-10-31');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskError, setTaskError] = useState('');

  const days: TimetableEvent['dayOfWeek'][] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectCode || !subjectName) {
      setEventError('Please specify subject code and course name.');
      return;
    }
    addTimetableEvent({
      dayOfWeek,
      startTime,
      endTime,
      subjectCode: subjectCode.toUpperCase(),
      subjectName,
      room,
      instructor: instructor || undefined,
      type: eventType,
    });
    setEventModalOpen(false);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) {
      setTaskError('Please specify task title.');
      return;
    }
    addTask({
      title: taskTitle.trim(),
      type: taskType,
      priority: taskPriority,
      dueDate: taskDueDate,
      completed: false,
      notes: taskNotes || undefined,
    });
    setTaskModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-indigo-600" />
            Timetable Schedule & Academic Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage lecture blocks, lab sessions, assignment milestones, and revision slots
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTaskTitle('');
              setTaskNotes('');
              setTaskError('');
              setTaskModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
          <button
            type="button"
            onClick={() => {
              setSubjectCode('');
              setSubjectName('');
              setEventError('');
              setEventModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Class Slot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timetable Schedule (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* View Mode Switcher */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveView('weekly')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeView === 'weekly'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                Weekly Grid
              </button>
              <button
                type="button"
                onClick={() => setActiveView('daily')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeView === 'daily'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                Daily View
              </button>
              <button
                type="button"
                onClick={() => setActiveView('compact')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeView === 'compact'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Compact List
              </button>
            </div>

            {activeView === 'daily' && (
              <div className="flex items-center gap-1 text-xs overflow-x-auto">
                {days.slice(0, 5).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDay(d)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                      selectedDay === d
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* VIEW 1: Weekly Grid */}
          {activeView === 'weekly' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {days.slice(0, 5).map((day) => {
                const dayEvents = timetable.filter((e) => e.dayOfWeek === day);
                return (
                  <div
                    key={day}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs space-y-3"
                  >
                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        {day}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {dayEvents.length} slots
                      </span>
                    </div>

                    <div className="space-y-2">
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1 group relative"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                              {ev.startTime} - {ev.endTime}
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteTimetableEvent(ev.id)}
                              className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remove slot"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                            {ev.subjectName}
                          </p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            {ev.room}
                          </p>
                        </div>
                      ))}

                      {dayEvents.length === 0 && (
                        <p className="text-[11px] text-slate-400 text-center py-4 italic">
                          No scheduled slots
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW 2: Daily View */}
          {activeView === 'daily' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Schedule for {selectedDay}
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {timetable
                  .filter((e) => e.dayOfWeek === selectedDay)
                  .map((ev) => (
                    <div key={ev.id} className="py-3 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {ev.startTime} — {ev.endTime}
                          </span>
                          <Badge variant="neutral" size="sm">
                            {ev.type}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {ev.subjectName} ({ev.subjectCode})
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {ev.room}
                          </span>
                          {ev.instructor && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {ev.instructor}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteTimetableEvent(ev.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* VIEW 3: Compact List */}
          {activeView === 'compact' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Day & Time</th>
                    <th className="py-2.5 px-4">Subject</th>
                    <th className="py-2.5 px-3">Room</th>
                    <th className="py-2.5 px-3">Instructor</th>
                    <th className="py-2.5 px-3 text-center">Type</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {timetable.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-medium">
                        {ev.dayOfWeek}, {ev.startTime}-{ev.endTime}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {ev.subjectName} ({ev.subjectCode})
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{ev.room}</td>
                      <td className="py-2.5 px-3 text-slate-500">{ev.instructor || '—'}</td>
                      <td className="py-2.5 px-3 text-center">
                        <Badge variant="neutral" size="sm">
                          {ev.type}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => deleteTimetableEvent(ev.id)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Task List Manager (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Academic Tasks & Milestones
              </h3>
              <p className="text-[11px] text-slate-400">
                {tasks.filter((t) => !t.completed).length} pending of {tasks.length}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                  task.completed
                    ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="mt-0.5 w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span
                      className={`font-semibold text-slate-800 dark:text-slate-200 ${
                        task.completed ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-400 hover:text-rose-500"
                    aria-label="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pl-6">
                  <span>Due: {task.dueDate}</span>
                  <Badge
                    variant={
                      task.priority === 'high'
                        ? 'danger'
                        : task.priority === 'medium'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {task.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Slot Modal */}
      <Modal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        title="Add Timetable Slot"
      >
        <form onSubmit={handleSaveEvent} className="space-y-3">
          {eventError && <p className="text-xs text-rose-500">{eventError}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Day of Week</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Session Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Lecture">Lecture</option>
                <option value="Lab">Lab</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Code</label>
              <input
                type="text"
                required
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="DS301"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 uppercase"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1">Subject Title</label>
              <input
                type="text"
                required
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Advanced Machine Learning"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Room / Lab</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Hall B-204"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Instructor (Optional)</label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="Dr. Radhika Sen"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEventModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg"
            >
              Save Slot
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Task Modal */}
      <Modal isOpen={taskModalOpen} onClose={() => setTaskModalOpen(false)} title="Create Task">
        <form onSubmit={handleSaveTask} className="space-y-3">
          {taskError && <p className="text-xs text-rose-500">{taskError}</p>}
          <div>
            <label className="block text-xs font-semibold mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Implement Transformer Self-Attention Exercise"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Type</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="assignment">Assignment</option>
                <option value="exam_prep">Exam Prep</option>
                <option value="project">Project Milestone</option>
                <option value="study_session">Study Session</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Due Date</label>
            <input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setTaskModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
