'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { Shield, Users, CheckSquare, MessageSquare, ArrowUpRight } from 'lucide-react';

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getAdminOverview()
      .then((res) => setOverview(res))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        <div className="space-y-1">
          <Badge variant="nonNegotiable">ADMIN EXCO PORTAL</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Platform Overview & Management</h1>
          <p className="text-xs text-slate-500">System analytics, participant rosters, task rules, and testimonial moderations</p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500 glass-panel rounded-2xl">
            Loading EXCO analytics...
          </div>
        ) : (
          <>
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card variant="glass" className="space-y-1 p-4 sm:p-6">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Participants</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">{overview?.stats?.totalParticipants || 0}</div>
              </Card>

              <Card variant="glass" className="space-y-1 p-4 sm:p-6">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Follow-Up Members</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">{overview?.stats?.totalFollowUps || 0}</div>
              </Card>

              <Card variant="glass" className="space-y-1 p-4 sm:p-6">
                <span className="text-[10px] font-bold text-brand-700 uppercase tracking-widest">Active System Tasks</span>
                <div className="text-2xl sm:text-3xl font-black text-brand-600">{overview?.stats?.totalTasks || 0}</div>
              </Card>

              <Card variant="glass" className="space-y-1 p-4 sm:p-6">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">Total Completions</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">{overview?.stats?.totalCompletions || 0}</div>
              </Card>
            </div>

            {/* Quick Navigation to Admin Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card variant="interactive" className="space-y-3">
                <div className="flex items-center justify-between">
                  <CheckSquare className="w-6 h-6 text-brand-600" />
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Task Engine Builder</h3>
                <p className="text-xs text-slate-600">
                  Configure daily, weekly, and non-negotiable tasks dynamically without modifying code.
                </p>
                <a href="/admin/tasks" className="block pt-2">
                  <Button variant="primary" size="sm" className="w-full">
                    Manage Tasks &rarr;
                  </Button>
                </a>
              </Card>

              <Card variant="interactive" className="space-y-3">
                <div className="flex items-center justify-between">
                  <Users className="w-6 h-6 text-emerald-600" />
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Follow-Up Matrix</h3>
                <p className="text-xs text-slate-600">
                  Monitor participant sub-groups and assign coaches to participants.
                </p>
                <a href="/follow-up" className="block pt-2">
                  <Button variant="secondary" size="sm" className="w-full">
                    View Follow-Up Portal &rarr;
                  </Button>
                </a>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
