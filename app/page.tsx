import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Footer } from '../components/layout/Footer';
import {
  Shield,
  Sparkles,
  Zap,
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
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-brand-cyan/15 via-brand-blue/10 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 px-4 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-brand-cyan/30 text-brand-cyan text-xs font-bold uppercase tracking-widest mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          Structured 90-Day Transformation System
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Trade Motivation for a <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-cyan via-blue-400 to-indigo-300 bg-clip-text text-transparent">
            Systematic Growth Architecture
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
          A professional 90-day platform engineered to build lasting consistency across your <strong className="text-purple-300">Spiritual</strong>, <strong className="text-cyan-300">Mental</strong>, and <strong className="text-emerald-300">Social</strong> pillars long after initial excitement fades.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
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
        <div className="mt-16 max-w-4xl mx-auto">
          <Card variant="gold" className="text-left relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Core Platform Philosophy
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  "Do NOT build a 90-day challenge that depends on motivation."
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Motivation gets you started; structured accountability keeps you standing. Your Time Trade separates emotional excitement from daily task completion through non-negotiable daily tracking, factual follow-up supervision, and community group integration.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* The Three Pillars Section */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="cyan">3 Pillars of Growth</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Comprehensive Personal Development
          </h2>
          <p className="text-sm text-slate-400">
            Balancing your spiritual depth, mental discipline, and social contribution across 90 calibrated days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1: Spiritual */}
          <Card variant="interactive" className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block">
              Pillar 01
            </span>
            <h3 className="text-xl font-bold text-white">Spiritual Growth</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Anchor your spirit through daily morning solitude, structured Bible character studies (e.g., Daniel), sermon note-taking, and periodic scriptural reflection.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> Daily Quiet Prayer & Solitude
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> Bible Character Analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> Weekly Sermon Reflections
              </li>
            </ul>
          </Card>

          {/* Pillar 2: Mental */}
          <Card variant="interactive" className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              Pillar 02
            </span>
            <h3 className="text-xl font-bold text-white">Mental & Financial Literacy</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Strengthen emotional development, financial acumen, business execution, decision-making systems, habits, and self-awareness through daily assigned readings and exercises.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Financial Systems & Cash Flow
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Emotional Intelligence Journaling
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Business Execution & Habit Audits
              </li>
            </ul>
          </Card>

          {/* Pillar 3: Social */}
          <Card variant="interactive" className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              Pillar 03
            </span>
            <h3 className="text-xl font-bold text-white">Social & Community</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Engage deeply with cohort members in our dedicated WhatsApp community, weekly thought contributions, group reflections, and encouraging peer interactions.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> WhatsApp Community Layer
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Weekly Thought Contributions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cohort Group Discussions
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Website vs WhatsApp Clarity Section */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <Card variant="glass" className="space-y-6">
            <div className="space-y-2">
              <Badge variant="cyan">System Architecture</Badge>
              <h3 className="text-2xl font-bold text-white">
                How Website & WhatsApp Work Together
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We separate informal community conversation from structured measurement so that tracking remains reliable and distraction-free.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" /> WhatsApp Community Layer
                </h4>
                <p className="text-xs text-slate-300">
                  Conversations, announcement broadcasts, group discussions, sermon debriefs, and social support.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-1">
                <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" /> Website Platform Layer
                </h4>
                <p className="text-xs text-slate-300">
                  Registration, daily/weekly task checklists, server-side streak calculations, follow-up monitoring, leaderboards, and calendar.
                </p>
              </div>
            </div>
          </Card>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card variant="solid" className="space-y-2">
              <Flame className="w-6 h-6 text-amber-400" />
              <h4 className="text-base font-bold text-white">Streak & Audit Engine</h4>
              <p className="text-xs text-slate-400">
                Database-backed proof of consistency with automatic streak recalculations.
              </p>
            </Card>

            <Card variant="solid" className="space-y-2">
              <Shield className="w-6 h-6 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Dedicated Follow-Up</h4>
              <p className="text-xs text-slate-400">
                Follow-up members oversee small sub-groups (5 participants) with factual inactivity flags.
              </p>
            </Card>

            <Card variant="solid" className="space-y-2">
              <Calendar className="w-6 h-6 text-cyan-400" />
              <h4 className="text-base font-bold text-white">90-Day Challenge Calendar</h4>
              <p className="text-xs text-slate-400">
                Categorized daily schedule across Phase 1 (Reset), Phase 2, and Phase 3.
              </p>
            </Card>

            <Card variant="solid" className="space-y-2">
              <Award className="w-6 h-6 text-purple-400" />
              <h4 className="text-base font-bold text-white">Positive Leaderboard</h4>
              <p className="text-xs text-slate-400">
                Encourages healthy consistency and completion percentage without shaming.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <Card variant="gold" className="p-12 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Ready to Build Unshakeable Consistency?
          </h2>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto">
            Join participants worldwide trading initial hype for a database-backed 90-day personal growth structure.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
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
