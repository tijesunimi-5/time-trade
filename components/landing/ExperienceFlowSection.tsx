'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Edit, MessageSquare, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { FadeUp } from '../motion/FadeUp';

export const ExperienceFlowSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Learn',
      desc: 'A curated resource introduces a core idea or framework.',
      icon: BookOpen,
    },
    {
      num: '02',
      title: 'Reflect',
      desc: 'You examine yourself through guided journal prompts.',
      icon: Edit,
    },
    {
      num: '03',
      title: 'Discuss',
      desc: 'You process insights alongside your cohort sub-group.',
      icon: MessageSquare,
    },
    {
      num: '04',
      title: 'Apply',
      desc: 'You translate reflection into concrete daily non-negotiable actions.',
      icon: CheckCircle,
    },
    {
      num: '05',
      title: 'Grow',
      desc: 'Systematic consistency embeds lasting personal change.',
      icon: TrendingUp,
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <FadeUp>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 px-3.5 py-1.5 rounded-full bg-blue-950 border border-blue-800">
              THE TRANSFORMATION SEQUENCE
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Engage <span className="text-blue-400">&rarr;</span> Reflect{' '}
              <span className="text-blue-400">&rarr;</span> Act{' '}
              <span className="text-blue-400">&rarr;</span> Grow
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              How insight turns into genuine, unshakeable habit transformation.
            </p>
          </FadeUp>
        </div>

        {/* Connected Step Sequence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12, duration: 0.5 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-blue-400 tracking-widest">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-white">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-blue-500/40">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
