import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Footer } from '../components/layout/Footer';
import {
  Shield,
  Sparkles,
  Target,
  Users,
  CheckCircle2,
  Calendar,
  BarChart3,
  Award,
  ArrowRight,
  Flame,
  BookOpen,
  Brain,
  HeartHandshake,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative overflow-hidden">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-500/10 via-brand-50 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-12 lg:pt-24 lg:pb-20 px-4 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-700 text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          Structured 90-Day Transformation System
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-5xl mx-auto leading-[1.1] mb-6">
          Trade Motivation for a <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Systematic Growth Architecture
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
          A professional 90-day platform engineered to build lasting consistency across your <strong className="text-purple-700 font-bold">Spiritual</strong>, <strong className="text-brand-700 font-bold">Mental</strong>, and <strong className="text-emerald-700 font-bold">Social</strong> pillars long after initial excitement fades.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <Link href="/register" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto text-base">
              Start 90-Day Challenge <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="glass" size="lg" className="w-full sm:w-auto text-base">
              Participant Sign In
            </Button>
          </Link>
        </div>

        {/* Philosophy Callout Card */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card variant="gold" className="text-left relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-700 shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
                  Core Platform Philosophy
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  "Do NOT build a 90-day challenge that depends on motivation."
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Motivation gets you started; structured accountability keeps you standing. Your Time Trade separates emotional excitement from daily task completion through non-negotiable daily tracking, factual follow-up supervision, and community group integration.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* The Three Pillars Section */}
      <section className="py-12 lg:py-16 px-4 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <Badge variant="cyan">3 Pillars of Growth</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Comprehensive Personal Development
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Balancing your spiritual depth, mental discipline, and social contribution across 90 calibrated days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Spiritual */}
          <Card variant="interactive" className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block">
              Pillar 01
            </span>
            <h3 className="text-xl font-bold text-slate-900">Spiritual Growth</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anchor your spirit through daily morning solitude, structured Bible character studies (e.g., Daniel), sermon note-taking, and periodic scriptural reflection.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" /> Daily Quiet Prayer & Solitude
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" /> Bible Character Analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" /> Weekly Sermon Reflections
              </li>
            </ul>
          </Card>

          {/* Pillar 2: Mental */}
          <Card variant="interactive" className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-brand-700">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
              Pillar 02
            </span>
            <h3 className="text-xl font-bold text-slate-900">Mental & Financial Literacy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strengthen emotional development, financial acumen, business execution, decision-making systems, habits, and self-awareness through daily assigned readings.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600" /> Financial Systems & Cash Flow
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600" /> Emotional Intelligence Journaling
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600" /> Business Execution & Habit Audits
              </li>
            </ul>
          </Card>

          {/* Pillar 3: Social */}
          <Card variant="interactive" className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
              Pillar 03
            </span>
            <h3 className="text-xl font-bold text-slate-900">Social & Community</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Engage deeply with cohort members in our dedicated WhatsApp community, weekly thought contributions, group reflections, and encouraging peer interactions.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> WhatsApp Community Layer
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Weekly Thought Contributions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cohort Group Discussions
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Website vs WhatsApp Clarity Section */}
      <section className="py-12 lg:py-16 px-4 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <Card variant="glass" className="space-y-5">
            <div className="space-y-1.5">
              <Badge variant="cyan">System Architecture</Badge>
              <h3 className="text-2xl font-bold text-slate-900">
                How Website & WhatsApp Work Together
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We separate informal community conversation from structured measurement so that tracking remains reliable and distraction-free.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" /> WhatsApp Community Layer
                </h4>
                <p className="text-xs text-slate-600">
                  Conversations, announcement broadcasts, group discussions, sermon debriefs, and social support.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                <h4 className="text-sm font-bold text-brand-800 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand-600" /> Website Platform Layer
                </h4>
                <p className="text-xs text-slate-600">
                  Registration, daily/weekly task checklists, server-side streak calculations, follow-up monitoring, leaderboards, and calendar.
                </p>
              </div>
            </div>
          </Card>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card variant="solid" className="space-y-2">
              <Flame className="w-6 h-6 text-amber-600" />
              <h4 className="text-base font-bold text-slate-900">Streak & Audit Engine</h4>
              <p className="text-xs text-slate-500">
                Database-backed proof of consistency with automatic streak recalculations.
              </p>
            </Card>

            <Card variant="solid" className="space-y-2">
              <Shield className="w-6 h-6 text-emerald-600" />
              <h4 className="text-base font-bold text-slate-900">Dedicated Follow-Up</h4>
              <p className="text-xs text-slate-500">
                Follow-up members oversee small sub-groups (5 participants) with factual inactivity flags.
              </p>
            </Card>

            <Card variant="solid" className="space-y-2">
              <Calendar className="w-6 h-6 text-brand-600" />
              <h4 className="text-base font-bold text-slate-900">90-Day Challenge Calendar</h4>
              <p className="text-xs text-slate-500">
                Categorized daily schedule across Phase 1 (Reset), Phase 2, and Phase 3.
              </p>
            </Card>

            <Card variant="solid" className="space-y-2">
              <Award className="w-6 h-6 text-purple-600" />
              <h4 className="text-base font-bold text-slate-900">Positive Leaderboard</h4>
              <p className="text-xs text-slate-500">
                Encourages healthy consistency and completion percentage without shaming.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <Card variant="gold" className="p-8 sm:p-12 space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            Ready to Build Unshakeable Consistency?
          </h2>
          <p className="text-xs sm:text-base text-slate-700 max-w-2xl mx-auto">
            Join participants worldwide trading initial hype for a database-backed 90-day personal growth structure.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-base">
                Register for the Challenge &rarr;
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
