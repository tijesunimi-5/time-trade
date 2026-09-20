'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { TaskCard } from '../../../components/features/TaskCard';
import { api } from '../../../services/api';
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
    } catch (err) {
      console.error('Failed to fetch day details:', err);
    } finally {
      setIsDayLoading(false);
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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              phaseNumber: 1,
              title: 'PHASE 1: RESET',
              subtitle: 'Days 1 – 30',
              desc: 'Pause friction, examine beliefs, habits & boundaries.',
              isLocked: false,
            },
            {
              phaseNumber: 2,
              title: 'PHASE 2: RESTART',
              subtitle: 'Days 31 – 60',
              desc: 'Rebuild healthier habits, systems & relationships.',
              isLocked: (calendarData?.activePhaseNumber || 1) < 2,
            },
            {
              phaseNumber: 3,
              title: 'PHASE 3: REFOCUS',
              subtitle: 'Days 61 – 90',
              desc: 'Intentionally commit long-term energy & focus.',
              isLocked: (calendarData?.activePhaseNumber || 1) < 3,
            },
          ].map((phase) => (
            <button
              key={phase.phaseNumber}
              onClick={() => setSelectedPhase(phase.phaseNumber)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                selectedPhase === phase.phaseNumber
                  ? 'bg-white border-brand-600 shadow-md ring-2 ring-brand-500/20'
                  : 'bg-white/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {phase.title}
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
              <div className="text-[11px] font-bold text-brand-600 mt-1">{phase.subtitle}</div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{phase.desc}</p>
            </button>
          ))}
        </div>

        {/* Selected Phase View */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 glass-panel rounded-2xl">
            Loading 90-day calendar overview...
          </div>
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
          </div>
        )}
      </div>
    </div>
  );
}
