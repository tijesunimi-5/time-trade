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
import { Flame, CheckCircle2, Trophy, Target, Sparkles } from 'lucide-react';

export default function ParticipantDashboard() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [activePillar, setActivePillar] = useState<'ALL' | 'SPIRITUAL' | 'MENTAL' | 'SOCIAL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [tasksRes, progressRes] = await Promise.all([
        api.getTodayTasks(),
        api.getProgress(),
      ]);

      setTasks(tasksRes.tasks);
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
    setTogglingId(taskId);
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );

    try {
      await api.toggleTask(taskId);
      // Refresh progress data in background
      const updatedProgress = await api.getProgress();
      setProgress(updatedProgress);
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

  const filteredTasks = tasks.filter((t) => {
    if (activePillar === 'ALL') return true;
    return t.pillar === activePillar;
  });

  const completedTodayCount = tasks.filter((t) => t.isCompleted).length;
  const totalTodayCount = tasks.length;

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        {/* Header Day & Phase Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 sm:p-6 rounded-2xl border-slate-200 shadow-subtle-sm relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2">
              <Badge variant="cyan">DAY 17 / 90</Badge>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">
                MONTH 1: RESET, RESTART, REFOCUS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
              Welcome back, {user?.fullName || 'Participant'}
            </h1>
            <p className="text-xs text-slate-600">
              Focus on today's daily non-negotiables to keep your consistency streak alive.
            </p>
          </div>

          <div className="flex items-center gap-4 z-10">
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-300 px-4 py-2.5 rounded-xl shadow-subtle-sm">
              <Flame className="w-7 h-7 text-amber-500 fill-amber-500 animate-pulse" />
              <div>
                <span className="text-xl font-black text-slate-900 block leading-none">
                  {progress?.streak?.currentStreak || 12} DAYS
                </span>
                <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest">
                  Current Streak
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 7 Core Answers Summary Cards */}
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
                Weekly Target
              </span>
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              19 / 25
            </div>
            <ProgressBar progress={76} color="emerald" />
          </Card>

          <Card variant="glass" className="space-y-2 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                90-Day Progress
              </span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {progress?.streak?.overallPercentage || 62}% OVERALL
            </div>
            <ProgressBar progress={progress?.streak?.overallPercentage || 62} color="purple" />
          </Card>

          <Card variant="glass" className="space-y-2 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                Current Rank
              </span>
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              RANK #4 GLOBAL
            </div>
            <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
              Top 5% Consistency Cohort
            </span>
          </Card>
        </div>

        {/* WhatsApp Banner Integration */}
        <WhatsAppCommunityBanner />

        {/* Today Tasks Checklist Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">Today's Growth Checklist</h2>
              <p className="text-xs text-slate-500">Complete your assigned pillar tasks below</p>
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
            <div className="p-12 text-center text-slate-500 glass-panel rounded-2xl">
              Loading today's tasks...
            </div>
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
    </div>
  );
}
