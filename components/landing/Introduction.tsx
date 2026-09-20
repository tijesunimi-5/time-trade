'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FadeUp } from '../motion/FadeUp';
import { BlurReveal } from '../motion/BlurReveal';

export const Introduction: React.FC = () => {
  const keywords = [
    { word: 'PAUSE', subtitle: 'Step back from daily friction' },
    { word: 'REFLECT', subtitle: 'Look inward without judgement' },
    { word: 'UNDERSTAND', subtitle: 'Examine patterns & beliefs' },
    { word: 'CHANGE', subtitle: 'Rebuild with intention' },
  ];

  const lifeNoises = [
    'Responsibilities',
    'Distractions',
    'Expectations',
    'Relationships',
    'Finances & Work',
    'Spiritual Life',
    'Personal Goals',
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-100 relative">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <FadeUp>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 inline-block">
              THE PROBLEM
            </span>
          </FadeUp>

          <BlurReveal delay={0.2}>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Sometimes you don’t need more motivation.{' '}
              <span className="text-blue-600 underline decoration-blue-200 underline-offset-4">
                You need a moment to reset.
              </span>
            </h2>
          </BlurReveal>

          <FadeUp delay={0.3}>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed pt-2">
              Life accumulates noise naturally. Day after day, responsibilities, expectations, and habitual routines pull your focus in every direction until intentional living gets replaced by reaction.
            </p>
          </FadeUp>
        </div>

        {/* Life Noise Pills Container */}
        <FadeUp delay={0.4}>
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Modern Life Friction Points
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {lifeNoises.map((noise, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs hover:border-blue-300 transition-colors"
                >
                  {noise}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 max-w-xl mx-auto pt-2">
              Your Time Trade creates a structured, intentional space to pause and examine where you currently are—before deciding where you want to go.
            </p>
          </div>
        </FadeUp>

        {/* Cinematic Scroll Reveal Keyword Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {keywords.map((item, index) => (
            <motion.div
              key={item.word}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="text-3xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                {item.word}
              </div>
              <p className="text-xs font-medium text-slate-500 pt-2">
                {item.subtitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
