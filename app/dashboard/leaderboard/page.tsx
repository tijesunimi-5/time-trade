'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { api } from '../../../services/api';
import { Trophy, Flame, Award, ShieldCheck } from 'lucide-react';

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
    <div className="flex min-h-[calc(100vh-65px)]">
      <Sidebar />
      <div className="flex-1 p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
        <div className="space-y-1">
          <Badge variant="cyan">Consistency Rankings</Badge>
          <h1 className="text-3xl font-black text-white">Global Cohort Leaderboard</h1>
          <p className="text-xs text-slate-400">Rankings based on consistency percentage and streak adherence</p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 glass-panel rounded-2xl">
            Loading leaderboard...
          </div>
        ) : (
          <Card variant="glass" className="space-y-4 p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-navy-900/60">
                    <th className="p-4 pl-6">Rank</th>
                    <th className="p-4">Participant</th>
                    <th className="p-4">Consistency %</th>
                    <th className="p-4">Current Streak</th>
                    <th className="p-4 pr-6">Total Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {rankings.map((r) => (
                    <tr key={r.rank} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 pl-6 font-black">
                        {r.rank === 1 ? (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-extrabold">
                            <Trophy className="w-4 h-4" /> #1
                          </span>
                        ) : r.rank === 2 ? (
                          <span className="text-slate-300 font-extrabold">#2</span>
                        ) : r.rank === 3 ? (
                          <span className="text-amber-600 font-extrabold">#3</span>
                        ) : (
                          <span className="text-slate-500 font-bold">#{r.rank}</span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-white flex items-center gap-3">
                        <img
                          src={r.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={r.fullName}
                          className="w-8 h-8 rounded-full border border-brand-cyan/40 object-cover"
                        />
                        {r.fullName}
                      </td>
                      <td className="p-4 font-extrabold text-brand-cyan">
                        {r.overallPercentage}%
                      </td>
                      <td className="p-4 font-bold text-amber-400 flex items-center gap-1">
                        <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                        {r.currentStreak} Days
                      </td>
                      <td className="p-4 pr-6 font-medium text-slate-300">
                        {r.totalCompleted} Tasks
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
