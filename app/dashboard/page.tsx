'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { TaskCard, Task } from '../../components/features/TaskCard';
import { WhatsAppCommunityBanner } from '../../components/features/WhatsAppCommunityBanner';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';
import { Flame, CheckCircle2, Trophy, Target, Sparkles, AlertCircle, Calendar } from 'lucide-react';

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
    <div className="flex min-h-[calc(100vh-65px)]">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
        {/* Header Day & Phase Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border-white/10 relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2">
              <Badge variant="cyan">DAY 17 / 90</Badge>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                MONTH 1: RESET, RESTART, REFOCUS
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white">
              Welcome back, {user?.fullName || 'Participant'}
            </h1>
            <p className="text-xs text-slate-300">
              Focus on today's daily non-negotiables to keep your consistency streak alive.
            </p>
          </div>

          <div className="flex items-center gap-4 z-10">
            <div className="flex items-center gap-3 bg-amber-950/40 border border-amber-500/40 px-4 py-2.5 rounded-xl">
              <Flame className="w-7 h-7 text-amber-400 animate-bounce" />
              <div>
                <span className="text-xl font-black text-white block leading-none">
                  {progress?.streak?.currentStreak || 12} DAYS
                </span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  Current Streak
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 7 Core Answers Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="glass" className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Today Completion
              </span>
              <CheckCircle2 className="w-5 h-5 text-brand-cyan" />
            </div>
            <div className="text-2xl font-black text-white">
              {completedTodayCount} / {totalTodayCount} COMPLETED
            </div>
            <ProgressBar progress={totalTodayCount ? (completedTodayCount / totalTodayCount) * 100 : 0} color="cyan" />
          </Card>

          <Card variant="glass" className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Weekly Target
              </span>
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">
              19 / 25 COMPLETED
            </div>
            <ProgressBar progress={76} color="emerald" />
          </Card>

          <Card variant="glass" className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                90-Day Progress
              </span>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {progress?.streak?.overallPercentage || 62}% OVERALL
            </div>
            <ProgressBar progress={progress?.streak?.overallPercentage || 62} color="purple" />
          </Card>

          <Card variant="glass" className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Rank
              </span>
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">
              RANK #4 GLOBAL
            </div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              Top 5% Consistency Cohort
            </span>
          </Card>
        </div>

        {/* WhatsApp Banner Integration */}
        <WhatsAppCommunityBanner />

        {/* Today Tasks Checklist Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Today's Growth Checklist</h2>
              <p className="text-xs text-slate-400">Complete your assigned pillar tasks below</p>
            </div>

            {/* Pillar Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl glass-panel">
              {(['ALL', 'SPIRITUAL', 'MENTAL', 'SOCIAL'] as const).map((pillar) => (
                <button
                  key={pillar}
                  onClick={() => setActivePillar(pillar)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activePillar === pillar
                      ? 'bg-brand-cyan text-navy-950 shadow-glow-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {pillar}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400 glass-panel rounded-2xl">
              Loading today's tasks...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-400 glass-panel rounded-2xl space-y-2">
              <p className="text-sm font-semibold">No tasks found for this filter.</p>
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
