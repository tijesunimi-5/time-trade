'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { Shield, Users, CheckSquare, MessageSquare, Award, Settings, ArrowUpRight } from 'lucide-react';

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
    <div className="flex min-h-[calc(100vh-65px)]">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
        <div className="space-y-1">
          <Badge variant="nonNegotiable">ADMIN EXCO PORTAL</Badge>
          <h1 className="text-3xl font-black text-white">Platform Overview & Management</h1>
          <p className="text-xs text-slate-400">System analytics, participant rosters, task rules, and testimonial moderations</p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 glass-panel rounded-2xl">
            Loading EXCO analytics...
          </div>
        ) : (
          <>
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card variant="glass" className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Participants</span>
                <div className="text-3xl font-black text-white">{overview?.stats?.totalParticipants || 0}</div>
              </Card>

              <Card variant="glass" className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Follow-Up Members</span>
                <div className="text-3xl font-black text-emerald-400">{overview?.stats?.totalFollowUps || 0}</div>
              </Card>

              <Card variant="glass" className="space-y-1">
                <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest">Active System Tasks</span>
                <div className="text-3xl font-black text-brand-cyan">{overview?.stats?.totalTasks || 0}</div>
              </Card>

              <Card variant="glass" className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Total Completions</span>
                <div className="text-3xl font-black text-amber-400">{overview?.stats?.totalCompletions || 0}</div>
              </Card>
            </div>

            {/* Quick Navigation to Admin Modules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="interactive" className="space-y-3">
                <div className="flex items-center justify-between">
                  <CheckSquare className="w-6 h-6 text-brand-cyan" />
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-white">Task Engine Builder</h3>
                <p className="text-xs text-slate-400">
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
                  <Users className="w-6 h-6 text-emerald-400" />
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-white">Participant Directory</h3>
                <p className="text-xs text-slate-400">
                  View complete cohort directory, profiles, and assign follow-up members.
                </p>
                <a href="/admin/participants" className="block pt-2">
                  <Button variant="secondary" size="sm" className="w-full">
                    View Participants &rarr;
                  </Button>
                </a>
              </Card>

              <Card variant="interactive" className="space-y-3">
                <div className="flex items-center justify-between">
                  <MessageSquare className="w-6 h-6 text-amber-400" />
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-white">Testimonial Queue</h3>
                <p className="text-xs text-slate-400">
                  Review and approve participant testimonials for the public website.
                </p>
                <a href="/admin/testimonials" className="block pt-2">
                  <Button variant="glass" size="sm" className="w-full">
                    Review Submissions ({overview?.stats?.pendingTestimonials || 0}) &rarr;
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
