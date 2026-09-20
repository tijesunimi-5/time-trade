'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { TaskCard, Task } from '../../components/features/TaskCard';
import { WhatsAppCommunityBanner } from '../../components/features/WhatsAppCommunityBanner';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';
import { Loader } from '../../components/ui/Loader';
import { toast } from '../../store/useToastStore';
import { Flame, CheckCircle2, Trophy, Target, Sparkles, BookOpen, Plus, X } from 'lucide-react';

export default function ParticipantDashboard() {
  const { user } = useAuthStore();
  const [programmeInfo, setProgrammeInfo] = useState<any>(null);
  const [dayData, setDayData] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [activePillar, setActivePillar] = useState<'ALL' | 'SPIRITUAL' | 'MENTAL' | 'SOCIAL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Add Personal Task Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');
  const [newDuration, setNewDuration] = useState('30');
  const [isAdding, setIsAdding] = useState(false);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [progRes, dayRes, progressRes] = await Promise.all([
        api.getCurrentProgramme().catch(() => null),
        api.getDayDetails().catch(() => null),
        api.getProgress().catch(() => null),
      ]);

      setProgrammeInfo(progRes);
      setDayData(dayRes);
      if (dayRes?.tasks) {
        setTasks(dayRes.tasks);
      }
      setProgress(progressRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    if (dayData && !dayData.isToday) return;

    setTogglingId(taskId);
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );

    try {
      await api.toggleTask(taskId, dayData?.targetDate);
      const updatedProgress = await api.getProgress().catch(() => null);
      if (updatedProgress) setProgress(updatedProgress);
    } catch (err) {
      console.error('Task toggle error:', err);
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleAddPersonalTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setIsAdding(true);
      await api.addPersonalTask({
        title: newTitle.trim(),
        category: newCategory,
        durationMinutes: parseInt(newDuration, 10) || 30,
      });
      setNewTitle('');
      setShowAddModal(false);
      toast.success('Habit Created', `"${newTitle.trim()}" added to your growth checklist.`);
      // Refresh day details
      const updatedDay = await api.getDayDetails();
      if (updatedDay?.tasks) setTasks(updatedDay.tasks);
    } catch (err) {
      console.error('Failed to add personal task:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (activePillar === 'ALL') return true;
    return t.pillar === activePillar;
  });

  const completedTodayCount = tasks.filter((t) => t.isCompleted).length;
  const totalTodayCount = tasks.length;
  const currentDayNum = programmeInfo?.currentDayNumber || dayData?.dayNumber || 1;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        {/* Header Day & Phase Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 sm:p-6 rounded-2xl border-slate-200 shadow-subtle-sm relative overflow-hidden">
          <div className="space-y-1.5 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="cyan">DAY {currentDayNum} / 90</Badge>
              <span className="text-[10px] sm:text-xs font-black text-brand-700 uppercase tracking-widest bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
                PHASE {programmeInfo?.currentPhaseNumber || 1}: {programmeInfo?.currentPhaseTitle || 'RESET'}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">
                WEEK {programmeInfo?.currentWeekNumber || 1}: {programmeInfo?.currentWeekTheme || 'Reset Your Mindset'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
              Welcome back, {user?.fullName || 'Participant'}
            </h1>
            <p className="text-xs text-slate-600">
              Today's Focus: <span className="font-bold text-slate-800">{dayData?.dayFocus || 'Examine patterns & non-negotiable spiritual/mental habits'}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 z-10">
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-300 px-4 py-2.5 rounded-xl shadow-subtle-sm">
              <Flame className="w-7 h-7 text-amber-500 fill-amber-500 animate-pulse" />
              <div>
                <span className="text-xl font-black text-slate-900 block leading-none">
                  {progress?.streak?.currentStreak || 0} DAYS
                </span>
                <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest">
                  Current Streak
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Week Anchor Resource Spotlight */}
        {programmeInfo?.anchorResource && (
          <div className="bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-900 text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 block">
                  Week {programmeInfo.currentWeekNumber} Anchor Resource
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {programmeInfo.anchorResource}
                </h3>
              </div>
            </div>
            <a
              href="/dashboard/calendar"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors shrink-0"
            >
              View Full 90-Day Calendar &rarr;
            </a>
          </div>
        )}

        {/* Core Progress Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card variant="glass" className="space-y-2 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                Today Completion
              </span>
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {completedTodayCount} / {totalTodayCount}
            </div>
            <ProgressBar progress={totalTodayCount ? (completedTodayCount / totalTodayCount) * 100 : 0} color="cyan" />
          </Card>

          <Card variant="glass" className="space-y-2 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Completed
              </span>
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {progress?.streak?.totalCompleted || 0} Tasks
            </div>
            <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
              Cumulative Growth Total
            </span>
          </Card>

          <Card variant="glass" className="space-y-2 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                90-Day Consistency
              </span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {Math.round(progress?.streak?.overallPercentage || 0)}% OVERALL
            </div>
            <ProgressBar progress={progress?.streak?.overallPercentage || 0} color="purple" />
          </Card>

          <Card variant="glass" className="space-y-2 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                Longest Streak
              </span>
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {progress?.streak?.longestStreak || 0} DAYS
            </div>
            <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">
              Personal Record
            </span>
          </Card>
        </div>

        {/* WhatsApp Banner Integration */}
        <WhatsAppCommunityBanner />

        {/* Today Tasks Checklist Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">Today's Growth Checklist</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg border border-brand-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Personal Habit
                </button>
              </div>
              <p className="text-xs text-slate-500">Complete assigned pillar tasks and curated resources below</p>
            </div>

            {/* Pillar Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 border border-slate-300/60 overflow-x-auto no-scrollbar">
              {(['ALL', 'SPIRITUAL', 'MENTAL', 'SOCIAL'] as const).map((pillar) => (
                <button
                  key={pillar}
                  onClick={() => setActivePillar(pillar)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activePillar === pillar
                      ? 'bg-brand-600 text-white shadow-subtle-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {pillar}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <Loader variant="card" text="Loading today's assigned growth tasks..." />
          ) : filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-500 glass-panel rounded-2xl space-y-2">
              <p className="text-sm font-semibold text-slate-700">No tasks found for this filter.</p>
              <p className="text-xs text-slate-500">Select another pillar or view all tasks.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  isLoading={togglingId === task.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Personal Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Custom Personal Habit</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPersonalTask} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Habit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20-min Morning Walk"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Reading">Reading</option>
                    <option value="Journaling">Journaling</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 shadow-md"
                >
                  {isAdding ? 'Adding...' : 'Save Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
