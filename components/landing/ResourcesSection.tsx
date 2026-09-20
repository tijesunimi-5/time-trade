'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Headphones, Radio, Video, MessageSquare, Edit3 } from 'lucide-react';
import { FadeUp } from '../motion/FadeUp';

export const ResourcesSection: React.FC = () => {
  const resourceTypes = [
    { name: 'Selected Books', icon: BookOpen, desc: 'Essential chapters & key concepts' },
    { name: 'Curated Podcasts', icon: Headphones, desc: 'Deep-dive conversations' },
    { name: 'Sermons & Insights', icon: Radio, desc: 'Spiritual grounding & wisdom' },
    { name: 'Targeted Videos', icon: Video, desc: 'Visual models & framework audits' },
    { name: 'Cohort Discussions', icon: MessageSquare, desc: 'Peer processing & dialogue' },
    { name: 'Guided Reflections', icon: Edit3, desc: 'Personal written exercises' },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
      {/* Soft Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <FadeUp>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 px-3.5 py-1.5 rounded-full bg-blue-950 border border-blue-800">
              CURATED RESOURCE ARCHITECTURE
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Less noise.{' '}
              <span className="text-blue-400">More meaning.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Every resource exists for a reason. Instead of asking participants to consume endless content, each week’s material is curated around a specific question or area of growth.
            </p>
          </FadeUp>
        </div>

        {/* Differentiator Banner Card */}
        <FadeUp delay={0.3}>
          <div className="p-8 sm:p-10 rounded-3xl bg-blue-950/60 border border-blue-800/80 backdrop-blur-md space-y-4 text-center max-w-4xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-300">
              CORE PROGRAMME DIFFERENTIATOR
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              "We filter information so you can focus on application."
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              You won't be buried under endless reading lists. You receive calibrated resources paired directly with structured weekly reflection prompts.
            </p>
          </div>
        </FadeUp>

        {/* Resource Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resourceTypes.map((type, idx) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{type.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{type.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
