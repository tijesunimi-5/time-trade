'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Users2, DollarSign } from 'lucide-react';
import { FadeUp } from '../motion/FadeUp';

export const ResetDeepDive: React.FC = () => {
  const themes = [
    {
      title: 'Mindset & Beliefs',
      subtitle: 'Internal Frameworks',
      icon: Brain,
      description:
        'Understand the core beliefs shaping how you perceive yourself, success, failure, and your future possibilities.',
      color: 'blue',
    },
    {
      title: 'Emotional Patterns',
      subtitle: 'Self-Regulation',
      icon: Heart,
      description:
        'Recognize how you experience, process, and respond to stress, conflict, and internal emotional shifts.',
      color: 'rose',
    },
    {
      title: 'Relationships & Boundaries',
      subtitle: 'Relational Health',
      icon: Users2,
      description:
        'Examine your closest relationships, communication habits, and personal boundaries with clarity and honesty.',
      color: 'purple',
    },
    {
      title: 'Money, Work & Business',
      subtitle: 'Financial Mindset',
      icon: DollarSign,
      description:
        'Audit your relationship with finances, career execution, personal stewardship, and financial responsibility.',
      color: 'emerald',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <FadeUp>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100">
              DEEP DIVE INTO PHASE 1
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Reset isn’t starting over.{' '}
              <span className="text-blue-600">It’s seeing clearly.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-base sm:text-lg text-slate-600">
              Four fundamental pillars examined during the first 30 days of Time Trade.
            </p>
          </FadeUp>
        </div>

        {/* 4 Large Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map((theme, index) => {
            const Icon = theme.icon;

            return (
              <motion.div
                key={theme.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 hover:shadow-subtle-lg transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      {theme.subtitle}
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      {theme.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {theme.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 text-xs font-bold text-slate-500 flex items-center justify-between">
                  <span>Structured Exploration</span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform inline-block">
                    &rarr;
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
