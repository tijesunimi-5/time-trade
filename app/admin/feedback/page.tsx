'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Loader } from '../../../components/ui/Loader';
import { api } from '../../../services/api';
import { toast } from '../../../store/useToastStore';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageCircleReply,
  Filter,
  UserCheck,
  XCircle,
} from 'lucide-react';

const STATUS_TABS = [
  { id: 'ALL', label: 'All Submissions' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'IN_PROGRESS', label: 'Under Review' },
  { id: 'RESOLVED', label: 'Resolved' },
  { id: 'DISMISSED', label: 'Closed' },
];

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Response Modal State
  const [activeFeedback, setActiveFeedback] = useState<any | null>(null);
  const [responseStatus, setResponseStatus] = useState<string>('RESOLVED');
  const [responseText, setResponseText] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadAdminFeedback = async (status?: string) => {
    try {
      setIsLoading(true);
      const res = await api.getAllFeedbackAdmin(status);
      setFeedbacks(res.feedbacks || []);
      if (res.metrics) {
        setMetrics(res.metrics);
      }
    } catch (err: any) {
      toast.error('Failed to load feedback', err.message || 'Unable to fetch admin feedback');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminFeedback(selectedStatus);
  }, [selectedStatus]);

  const handleOpenResponseModal = (fb: any) => {
    setActiveFeedback(fb);
    setResponseStatus(fb.status || 'RESOLVED');
    setResponseText(fb.adminResponse || '');
  };

  const handleSaveResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFeedback) return;

    try {
      setIsUpdating(true);
      const res = await api.respondToFeedbackAdmin(activeFeedback.id, {
        status: responseStatus,
        adminResponse: responseText,
      });
      toast.success('Feedback Updated', res.message || 'Status and response saved.');
      setActiveFeedback(null);
      loadAdminFeedback(selectedStatus);
    } catch (err: any) {
      toast.error('Update Failed', err.message || 'Unable to update feedback record.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolved
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full text-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Under Review
          </span>
        );
      case 'DISMISSED':
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-full text-xs">
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="space-y-1">
          <Badge variant="attention">EXCO CONTROL CENTER</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Feedback Management</h1>
          <p className="text-xs text-slate-500 max-w-2xl">
            Review, track, and respond to feedback, bug reports, and feature requests submitted by cohort participants and committee members.
          </p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="glass" className="p-4 space-y-1 bg-white">
            <p className="text-xs font-bold text-slate-500">Total Submitted</p>
            <p className="text-2xl font-black text-slate-900">{metrics.total}</p>
          </Card>
          <Card variant="glass" className="p-4 space-y-1 bg-amber-50/50 border-amber-100">
            <p className="text-xs font-bold text-amber-700">Pending Review</p>
            <p className="text-2xl font-black text-amber-800">{metrics.pending}</p>
          </Card>
          <Card variant="glass" className="p-4 space-y-1 bg-blue-50/50 border-blue-100">
            <p className="text-xs font-bold text-blue-700">Under Review</p>
            <p className="text-2xl font-black text-blue-800">{metrics.inProgress}</p>
          </Card>
          <Card variant="glass" className="p-4 space-y-1 bg-emerald-50/50 border-emerald-100">
            <p className="text-xs font-bold text-emerald-700">Resolved</p>
            <p className="text-2xl font-black text-emerald-800">{metrics.resolved}</p>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/60 rounded-xl max-w-fit">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
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

        {/* Feedback List */}
        {isLoading ? (
          <Loader variant="card" text="Loading platform feedback..." />
        ) : feedbacks.length === 0 ? (
          <Card variant="glass" className="p-10 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Feedback Found</h3>
            <p className="text-xs text-slate-400">
              There are no feedback submissions matching the selected filter.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((fb) => (
              <Card key={fb.id} variant="glass" className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        fb.user?.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={fb.user?.fullName || 'User'}
                      className="w-9 h-9 rounded-full border-2 border-slate-200 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {fb.user?.fullName || 'Anonymous'}
                        </span>
                        <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                          {fb.user?.role || 'PARTICIPANT'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{fb.user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(fb.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {getStatusBadge(fb.status)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {fb.category.replace('_', ' ')}
                    </span>
                    <h3 className="text-sm font-black text-slate-900">{fb.subject}</h3>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{fb.message}</p>
                </div>

                {/* Existing Response */}
                {fb.adminResponse && (
                  <div className="bg-brand-50/70 border border-brand-200 rounded-xl p-3.5 space-y-1">
                    <div className="flex items-center justify-between text-xs text-brand-900 font-bold">
                      <span className="inline-flex items-center gap-1.5 text-brand-700">
                        <MessageCircleReply className="w-4 h-4 text-brand-600" />
                        Response by {fb.respondedBy || 'EXCO Team'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed pl-5 whitespace-pre-wrap">
                      {fb.adminResponse}
                    </p>
                  </div>
                )}

                {/* Action Row */}
                <div className="flex justify-end pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => handleOpenResponseModal(fb)}
                  >
                    <MessageCircleReply className="w-4 h-4" />
                    {fb.adminResponse ? 'Edit Response / Status' : 'Respond & Change Status'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal for Responding & Updating Status */}
        {activeFeedback && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <Card variant="glass" className="w-full max-w-lg space-y-4 p-6 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-brand-600" />
                  <h3 className="text-base font-black text-slate-900">Respond to Feedback</h3>
                </div>
                <button
                  onClick={() => setActiveFeedback(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <p className="font-bold text-slate-900">
                  {activeFeedback.user?.fullName} ({activeFeedback.user?.role})
                </p>
                <p className="font-bold text-brand-700">{activeFeedback.subject}</p>
                <p className="text-slate-600 line-clamp-3">{activeFeedback.message}</p>
              </div>

              <form onSubmit={handleSaveResponse} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Set Status</label>
                  <select
                    value={responseStatus}
                    onChange={(e) => setResponseStatus(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="PENDING">Pending Review</option>
                    <option value="IN_PROGRESS">Under Review / Working on it</option>
                    <option value="RESOLVED">Resolved / Completed</option>
                    <option value="DISMISSED">Closed / Dismissed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Official EXCO Response Note
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write a response note to the user explaining what action was taken..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveFeedback(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save & Send Response'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
