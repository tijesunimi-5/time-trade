'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { TaskCard } from '../../../components/features/TaskCard';
import { api } from '../../../services/api';
import { Loader } from '../../../components/ui/Loader';
import { toast } from '../../../store/useToastStore';
import {
  Calendar as CalendarIcon,
  Lock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';

export default function CalendarPage() {
  const [calendarData, setCalendarData] = useState<any>(null);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);
  const [dayDetails, setDayDetails] = useState<any>(null);
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDayLoading, setIsDayLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [journalNote, setJournalNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  const loadCalendar = async () => {
    try {
      setIsLoading(true);
      const res = await api.getCalendarOverview();
      setCalendarData(res);
      if (res.currentDayNumber) {
        const activePhase = Math.min(3, Math.max(1, Math.ceil(res.currentDayNumber / 30)));
        setSelectedPhase(activePhase);
      }
    } catch (err) {
      console.error('Failed to load calendar overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  const handleSelectDay = async (dayNumber: number) => {
    try {
      setSelectedDayNumber(dayNumber);
      setIsDayLoading(true);
      const details = await api.getDayDetails(dayNumber);
      setDayDetails(details);
      if (details?.journalNote !== undefined) {
        setJournalNote(details.journalNote);
      } else {
        setJournalNote('');
      }
    } catch (err) {
      console.error('Failed to fetch day details:', err);
    } finally {
      setIsDayLoading(false);
    }
  };

  const handleSaveJournalNote = async () => {
    if (!dayDetails?.targetDate) return;
    try {
      setIsSavingNote(true);
      await api.saveJournalNote({
        noteDate: dayDetails.targetDate,
        dayNumber: dayDetails.dayNumber || selectedDayNumber || 1,
        content: journalNote,
      });
      toast.success('Journal Reflection Saved', `Note for Day ${dayDetails.dayNumber || selectedDayNumber} saved.`);
    } catch (err: any) {
      toast.error('Save Failed', err.message || 'Unable to save journal note');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (!dayDetails?.isToday) return;
    setTogglingId(taskId);

    // Optimistic UI update for day details
    setDayDetails((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.map((t: any) =>
          t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
        ),
      };
    });

    try {
      await api.toggleTask(taskId, dayDetails.targetDate);
      // Refresh calendar overview in background
      loadCalendar();
    } catch (err: any) {
      console.error('Task toggle error:', err);
      // Revert on error
      setDayDetails((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          tasks: prev.tasks.map((t: any) =>
            t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
          ),
        };
      });
    } finally {
      setTogglingId(null);
    }
  };

  const currentPhaseObj = calendarData?.phases?.find(
    (p: any) => p.phaseNumber === selectedPhase
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 sm:p-6 rounded-2xl border-slate-200 shadow-subtle-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="cyan">90-DAY PROGRAMME CALENDAR</Badge>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">
                Start Date: {calendarData?.programme?.startDate || '2026-09-27'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
              Interactive 90-Day Transformation Roadmap
            </h1>
            <p className="text-xs text-slate-600">
              Select any day to view curated daily reading assignments, timestamped podcasts, and reflection prompts.
            </p>
          </div>

          {calendarData && (
            <div className="flex items-center gap-3">
              <div className="bg-brand-50 border border-brand-200 px-4 py-2.5 rounded-xl text-center">
                <span className="text-xs font-extrabold text-brand-800 uppercase tracking-wider block">
                  Current Day
                </span>
                <span className="text-xl font-black text-brand-600">
                  DAY {calendarData.currentDayNumber} / 90
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Phase Navigation Tabs */}
        {calendarData?.phases?.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Programme Schedule Published Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your EXCO leadership team has not published any active phases or week schedules yet. Check back soon for cohort activities!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {calendarData?.phases?.map((phase: any) => (
              <button
                key={phase.id || phase.phaseNumber}
                onClick={() => setSelectedPhase(phase.phaseNumber)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  selectedPhase === phase.phaseNumber
                    ? 'bg-white border-brand-600 shadow-md ring-2 ring-brand-500/20'
                    : 'bg-white/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Phase {phase.phaseNumber}: {phase.title}
                  </span>
                  {phase.isLocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Lock className="w-3 h-3 text-amber-600" />
                      LOCKED
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      UNLOCKED
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-bold text-brand-600 mt-1">
                  Duration: {phase.durationDays || 30} Days ({phase.weeks?.length || 0} Weeks)
                </div>
                {phase.objective && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{phase.objective}</p>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Selected Phase View */}
        {isLoading ? (
          <Loader variant="card" text="Loading 90-day calendar overview..." />
        ) : (
          <div className="space-y-6">
            {/* Week-by-Week Breakdown */}
            {currentPhaseObj?.weeks?.map((week: any) => (
              <div key={week.id} className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-subtle-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">
                      WEEK {week.weekNumber} THEME
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {week.theme}
                    </h2>
                  </div>
                  {week.anchorResource && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                      <BookOpen className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span>{week.anchorResource}</span>
                    </div>
                  )}
                </div>

                {/* Days Grid (7 Days per Week) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                  {week.days?.map((day: any) => {
                    const isSelected = selectedDayNumber === day.dayNumber;
                    return (
                      <button
                        key={day.id}
                        onClick={() => handleSelectDay(day.dayNumber)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[90px] relative ${
                          day.isToday
                            ? 'bg-gradient-to-br from-brand-50 to-cyan-50 border-brand-500 shadow-md ring-2 ring-brand-500/30'
                            : isSelected
                            ? 'bg-slate-100 border-slate-400'
                            : day.isPast
                            ? 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                            : 'bg-white border-slate-200 hover:border-brand-400'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-black text-slate-900">
                            DAY {day.dayNumber}
                          </span>
                          {day.isToday && (
                            <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
                          )}
                          {day.isFullyCompleted && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>

                        <div className="text-[10px] font-bold text-slate-600 truncate mt-1">
                          {day.title ? day.title.replace(/^Day \d+:\s*/, '') : `Day ${day.dayNumber}`}
                        </div>

                        <div className="mt-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[9px] font-semibold text-slate-500">
                          <span>{day.date.slice(5)}</span>
                          <span>
                            {day.completedTasks}/{day.totalTasks}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Day Details Drawer / Section */}
        {selectedDayNumber && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-brand-500 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedDayNumber(null)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="cyan">DAY {dayDetails?.dayNumber || selectedDayNumber}</Badge>
                    <span className="text-xs font-bold text-slate-500">{dayDetails?.targetDate}</span>
                    {dayDetails?.isToday && <Badge variant="emerald">TODAY (INTERACTIVE)</Badge>}
                    {dayDetails?.isPast && <Badge variant="slate">PAST (READ-ONLY)</Badge>}
                    {dayDetails?.isFuture && <Badge variant="purple">PREVIEW (READ-ONLY)</Badge>}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    {dayDetails?.dayTitle || `Day ${selectedDayNumber}`}
                  </h3>
                </div>
              </div>

              {dayDetails?.weekTheme && (
                <div className="hidden sm:block text-right">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                    Week {dayDetails.weekNumber} Theme
                  </span>
                  <span className="text-xs font-bold text-slate-700">{dayDetails.weekTheme}</span>
                </div>
              )}
            </div>

            {dayDetails?.dayFocus && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                <span className="font-bold text-slate-900 block mb-0.5">Daily Objective & Focus:</span>
                {dayDetails.dayFocus}
              </div>
            )}

            {/* Interaction Guard Hint Banner */}
            {!dayDetails?.isToday && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {dayDetails?.isFuture
                    ? 'This is a future day preview. Task checkboxes become interactive on the assigned date.'
                    : 'This is a previous day read-only record.'}
                </span>
              </div>
            )}

            {/* Tasks List */}
            {isDayLoading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading tasks for Day {selectedDayNumber}...</div>
            ) : dayDetails?.tasks?.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No tasks assigned for this day yet.</div>
            ) : (
              <div className="space-y-3 pt-2">
                {dayDetails?.tasks?.map((task: any) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    isLoading={togglingId === task.id}
                    isReadOnly={!dayDetails?.isToday}
                    readOnlyMessage={dayDetails?.isFuture ? 'Future day preview' : 'Past day history'}
                  />
                ))}
              </div>
            )}

            {/* Daily Journal Reflection Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h4 className="text-xs font-bold text-slate-900">
                    My Daily Reflection & Thought Notes (Day {dayDetails?.dayNumber || selectedDayNumber})
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Private Note</span>
              </div>
              <textarea
                rows={3}
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="Document your thoughts, friction points, prayers, or lessons from this day..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveJournalNote}
                  disabled={isSavingNote}
                  className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  {isSavingNote ? 'Saving...' : 'Save Reflection Note'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
