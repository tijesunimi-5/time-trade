'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Compass, RotateCcw, Target, ArrowRight } from 'lucide-react';
import { FadeUp } from '../motion/FadeUp';

export const Journey: React.FC = () => {
  const [activePhase, setActivePhase] = useState(0);

  const phases = [
    {
      number: '01',
      title: 'RESET',
      tagline: 'Stop. Look inward. Understand where you are.',
      icon: Compass,
      description:
        'The first 30 days are dedicated to pausing friction. Before changing habits, you must understand the underlying beliefs, emotional patterns, and relational dynamics shaping your choices.',
      focusAreas: [
        'Mindset & Core Beliefs',
        'Emotional Response Patterns',
        'Relationships & Boundary Audits',
        'Financial & Work Mindset',
        'Personal Self-Awareness',
      ],
      quote: '"Understanding where you are is the prerequisite for intentional change."',
    },
    {
      number: '02',
      title: 'RESTART',
      tagline: 'Begin rebuilding what needs to change.',
      icon: RotateCcw,
      description:
        'Days 31 to 60 shift into deliberate reconstruction. Taking insights uncovered during RESET, you begin building structured habits, healthy routines, and disciplined practices.',
      focusAreas: [
        'Daily Non-Negotiable Habits',
        'Personal Responsibility & Discipline',
        'Healthier Emotional Systems',
        'Spiritual Growth Practices',
        'Relational Communication',
      ],
      quote: '"Consistency doesn’t come from motivation; it comes from structure."',
    },
    {
      number: '03',
      title: 'REFOCUS',
      tagline: 'Decide what deserves your energy.',
      icon: Target,
      description:
        'The final 30 days clarify your long-term direction. You refine your priorities, strip away unnecessary noise, and commit your energy to what truly matters.',
      focusAreas: [
        'Clear Priority Alignment',
        'Time Management & Purpose',
        'Goal Architecture',
        'Long-Term Systemic Discipline',
        'Intentional Forward Motion',
      ],
      quote: '"Refocusing is knowing what to say NO to so your YES carries weight."',
    },
  ];

  return (
    <section id="journey" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <FadeUp>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200">
              THE 90-DAY ARCHITECTURE
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              A 3-Phase Transformation Journey
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-base sm:text-lg text-slate-600">
              Not a random collection of challenges. A structured 90-day progression designed for real growth.
            </p>
          </FadeUp>
        </div>

        {/* Phase Navigation Tabs */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 border-b border-slate-200 pb-4">
          {phases.map((phase, idx) => {
            const Icon = phase.icon;
            const isActive = activePhase === idx;

            return (
              <button
                key={phase.title}
                onClick={() => setActivePhase(idx)}
                className={`flex-1 text-left p-6 rounded-2xl transition-all relative border ${
                  isActive
                    ? 'bg-white border-blue-600 shadow-md scale-[1.02]'
                    : 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    PHASE {phase.number}
                  </span>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                </div>
                <h3 className="text-xl font-black text-slate-900">{phase.title}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">
                  {phase.tagline}
                </p>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full hidden md:block"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Detail Card View */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-subtle-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                    PHASE {phases[activePhase].number} FOCUS
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                    {phases[activePhase].title}: {phases[activePhase].tagline}
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {phases[activePhase].description}
                </p>

                {/* Focus Areas List */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Key Programme Deliverables
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {phases[activePhase].focusAreas.map((area) => (
                      <div
                        key={area}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-bold text-slate-800"
                      >
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Editorial Quote Box */}
              <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-slate-900 text-white p-8 rounded-2xl space-y-6 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
                    Phase Philosophy
                  </span>
                  <blockquote className="text-lg sm:text-xl font-medium leading-relaxed italic text-blue-50">
                    {phases[activePhase].quote}
                  </blockquote>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-blue-200 font-semibold">
                  <span>Days {activePhase === 0 ? '1–30' : activePhase === 1 ? '31–60' : '61–90'}</span>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <span>How it works</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
