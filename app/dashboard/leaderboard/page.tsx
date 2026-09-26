'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Loader } from '../../../components/ui/Loader';
import { api } from '../../../services/api';
import { Trophy, Flame, Clock, Award, Zap, Info } from 'lucide-react';

const PERIOD_TABS = [
  { id: 'TODAY', label: 'Today' },
  { id: 'THIS_WEEK', label: 'This Week' },
  { id: 'LAST_WEEK', label: 'Last Week' },
  { id: 'THIS_MONTH', label: 'This Month' },
  { id: 'ALL_TIME', label: 'Overall' },
];

export default function LeaderboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('TODAY');
  const [rankings, setRankings] = useState<any[]>([]);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  const loadLeaderboard = (period: string) => {
    setIsLoading(true);
    api.getLeaderboard(period)
      .then((res) => {
        setRankings(res.rankings || []);
        setIsLive(res.isLive ?? true);
      })
      .catch((err) => console.error('Failed to load leaderboard:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadLeaderboard(selectedPeriod);
  }, [selectedPeriod]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="cyan">PARTICIPANT RANKINGS</Badge>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                <Award className="w-3.5 h-3.5" /> 5 Credits / Task
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Global Cohort Leaderboard</h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              Rankings are calculated dynamically based on completed daily tasks (5 credits per task). Ties are broken on a First Come First Serve (FCFS) basis.
            </p>
          </div>
        </div>

        {/* Timeframe Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/60 rounded-xl max-w-fit">
          {PERIOD_TABS.map((tab) => {
            const isActive = selectedPeriod === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedPeriod(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                  isActive
                    ? 'bg-white text-brand-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Uncommenced Notice */}
        {!isLive && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 text-amber-900 flex items-start sm:items-center gap-4 shadow-sm">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-amber-950 uppercase tracking-wide">
                Leaderboard Pending Commencement
              </h3>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Activities have not been published by Admin yet. Rankings will populate live as tasks are assigned and participants begin submitting their daily completions.
              </p>
            </div>
          </div>
        )}

        {/* Scoring Rules Legend */}
        <Card variant="glass" className="p-4 bg-gradient-to-r from-brand-50/50 to-indigo-50/50 border-brand-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <Info className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Leaderboard Scoring & Tie-Breaker Rules:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-md border border-slate-200">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                1 Task = 5 Credits
              </span>
              <span className="inline-flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-md border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                Tie-Breaker: FCFS (Earliest Completion Time)
              </span>
            </div>
          </div>
        </Card>

        {/* Leaderboard Table */}
        {isLoading ? (
          <Loader variant="card" text="Loading participant rankings..." />
        ) : (
          <Card variant="glass" className="space-y-4 p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100/70">
                    <th className="p-3 sm:p-4 pl-4 sm:pl-6">Rank</th>
                    <th className="p-3 sm:p-4">Participant</th>
                    <th className="p-3 sm:p-4">Total Credits</th>
                    <th className="p-3 sm:p-4">Completed Tasks</th>
                    <th className="p-3 sm:p-4">FCFS Time</th>
                    <th className="p-3 sm:p-4 pr-4 sm:pr-6">Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {rankings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-xs text-slate-500">
                        No participant task completions recorded for this timeframe yet.
                      </td>
                    </tr>
                  ) : (
                    rankings.map((r) => (
                      <tr key={r.participantId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 sm:p-4 pl-4 sm:pl-6 font-black">
                          {r.rank === 1 ? (
                            <span className="inline-flex items-center gap-1 text-amber-600 font-extrabold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                              <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" /> #1
                            </span>
                          ) : r.rank === 2 ? (
                            <span className="inline-flex items-center gap-1 text-slate-700 font-extrabold bg-slate-100 px-2.5 py-1 rounded-lg">
                              #2
                            </span>
                          ) : r.rank === 3 ? (
                            <span className="inline-flex items-center gap-1 text-amber-800 font-extrabold bg-amber-100/50 px-2.5 py-1 rounded-lg">
                              #3
                            </span>
                          ) : (
                            <span className="text-slate-400 font-bold px-1">#{r.rank}</span>
                          )}
                        </td>
                        <td className="p-3 sm:p-4 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                r.avatarUrl ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                              }
                              alt={r.fullName}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-brand-200 object-cover shadow-xs"
                            />
                            <span className="truncate max-w-[140px] sm:max-w-none font-extrabold text-slate-900">
                              {r.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 font-black text-brand-600">
                          <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 px-3 py-1 rounded-lg font-black text-xs sm:text-sm">
                            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            {r.credits} pts
                          </span>
                        </td>
                        <td className="p-3 sm:p-4 font-bold text-slate-700">
                          {r.completedTasks} {r.completedTasks === 1 ? 'task' : 'tasks'}
                        </td>
                        <td className="p-3 sm:p-4 font-semibold text-slate-500 text-xs">
                          {r.fcfsTime ? (
                            <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-mono">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {r.fcfsTime}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="p-3 sm:p-4 pr-4 sm:pr-6 font-bold text-amber-600">
                          <span className="inline-flex items-center gap-1">
                            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                            {r.currentStreak} d
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
