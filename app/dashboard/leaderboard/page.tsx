'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { api } from '../../../services/api';
import { Trophy, Flame } from 'lucide-react';

export default function LeaderboardPage() {
  const [rankings, setRankings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getLeaderboard()
      .then((res) => setRankings(res.rankings))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        <div className="space-y-1">
          <Badge variant="cyan">Consistency Rankings</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Global Cohort Leaderboard</h1>
          <p className="text-xs text-slate-500">Rankings based on consistency percentage and streak adherence</p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500 glass-panel rounded-2xl">
            Loading leaderboard...
          </div>
        ) : (
          <Card variant="glass" className="space-y-4 p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100/70">
                    <th className="p-3 sm:p-4 pl-4 sm:pl-6">Rank</th>
                    <th className="p-3 sm:p-4">Participant</th>
                    <th className="p-3 sm:p-4">Consistency</th>
                    <th className="p-3 sm:p-4">Current Streak</th>
                    <th className="p-3 sm:p-4 pr-4 sm:pr-6">Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {rankings.map((r) => (
                    <tr key={r.rank} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 sm:p-4 pl-4 sm:pl-6 font-black">
                        {r.rank === 1 ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-extrabold">
                            <Trophy className="w-4 h-4" /> #1
                          </span>
                        ) : r.rank === 2 ? (
                          <span className="text-slate-600 font-extrabold">#2</span>
                        ) : r.rank === 3 ? (
                          <span className="text-amber-700 font-extrabold">#3</span>
                        ) : (
                          <span className="text-slate-400 font-bold">#{r.rank}</span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
                        <img
                          src={r.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={r.fullName}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-brand-300 object-cover"
                        />
                        <span className="truncate max-w-[120px] sm:max-w-none">{r.fullName}</span>
                      </td>
                      <td className="p-3 sm:p-4 font-extrabold text-brand-600">
                        {r.overallPercentage}%
                      </td>
                      <td className="p-3 sm:p-4 font-bold text-amber-600 flex items-center gap-1">
                        <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                        {r.currentStreak} d
                      </td>
                      <td className="p-3 sm:p-4 pr-4 sm:pr-6 font-medium text-slate-600">
                        {r.totalCompleted} tasks
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
