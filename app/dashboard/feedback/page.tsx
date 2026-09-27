'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Loader } from '../../../components/ui/Loader';
import { api } from '../../../services/api';
import { toast } from '../../../store/useToastStore';
import { MessageSquare, Send, CheckCircle2, Clock, AlertCircle, Sparkles, MessageCircleReply } from 'lucide-react';

const CATEGORIES = [
  { id: 'GENERAL', label: 'General Feedback' },
  { id: 'BUG_REPORT', label: 'Bug / Technical Issue' },
  { id: 'FEATURE_REQUEST', label: 'Feature Request' },
  { id: 'TASK_ISSUE', label: 'Task Content Issue' },
  { id: 'APP_EXPERIENCE', label: 'Platform Experience' },
];

export default function ParticipantFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [category, setCategory] = useState('GENERAL');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadMyFeedback = async () => {
    try {
      setIsLoading(true);
      const res = await api.getMyFeedback();
      setFeedbacks(res.feedbacks || []);
    } catch (err: any) {
      console.error('Failed to fetch feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMyFeedback();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Validation Error', 'Please fill in both the subject and detailed message.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.submitFeedback({ category, subject, message });
      toast.success('Feedback Submitted', res.message || 'Thank you for your feedback!');
      setSubject('');
      setMessage('');
      setCategory('GENERAL');
      loadMyFeedback();
    } catch (err: any) {
      toast.error('Submission Failed', err.message || 'Unable to submit feedback.');
    } finally {
      setIsSubmitting(false);
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
          <Badge variant="cyan">COMMUNITY FEEDBACK</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Feedback & Suggestions</h1>
          <p className="text-xs text-slate-500 max-w-2xl">
            Have questions, ideas, or feedback? Drop your thoughts below. Our EXCO and Admin team reviews every submission to continuously improve the Time Trade experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Column */}
          <div className="lg:col-span-5 space-y-4">
            <Card variant="glass" className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <MessageSquare className="w-5 h-5 text-brand-600" />
                <h2 className="text-base font-black text-slate-900">Submit New Feedback</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
                  <Input
                    type="text"
                    placeholder="Brief title or summary of your feedback..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Message</label>
                  <textarea
                    rows={5}
                    placeholder="Explain your feedback, issue, or request in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center gap-2"
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting Feedback...' : 'Send Feedback to EXCO'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Submitted History Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900">My Submitted Feedback</h2>
              <span className="text-xs text-slate-500 font-bold">{feedbacks.length} items</span>
            </div>

            {isLoading ? (
              <Loader variant="card" text="Loading your submitted feedback..." />
            ) : feedbacks.length === 0 ? (
              <Card variant="glass" className="p-8 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">No Feedback Submitted Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When you submit feedback or questions, your submissions and official responses from the EXCO team will appear here.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {feedbacks.map((fb) => (
                  <Card key={fb.id} variant="glass" className="p-4 sm:p-5 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {fb.category.replace('_', ' ')}
                          </span>
                          {getStatusBadge(fb.status)}
                        </div>
                        <h3 className="text-sm font-black text-slate-900">{fb.subject}</h3>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">
                        {new Date(fb.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{fb.message}</p>

                    {/* Admin Response Box */}
                    {fb.adminResponse && (
                      <div className="bg-brand-50/70 border border-brand-200 rounded-xl p-3 sm:p-4 space-y-1 mt-2">
                        <div className="flex items-center justify-between text-xs text-brand-900 font-bold">
                          <span className="inline-flex items-center gap-1.5 text-brand-700">
                            <MessageCircleReply className="w-4 h-4 text-brand-600" />
                            Response from {fb.respondedBy || 'EXCO Team'}
                          </span>
                          <span className="text-[10px] text-brand-600 font-medium">Official Response</span>
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed pl-5 whitespace-pre-wrap">
                          {fb.adminResponse}
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
