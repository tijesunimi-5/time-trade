'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquareHeart, Sparkles, ShieldCheck } from 'lucide-react';
import { FadeUp } from '../motion/FadeUp';

export const CommunitySection: React.FC = () => {
  const communityPillars = [
    {
      title: 'Shared Learning',
      desc: 'Process weekly resources alongside peers examining the same questions.',
      icon: Users,
    },
    {
      title: 'Meaningful Dialogue',
      desc: 'Engage in thoughtful weekly cohort discussions beyond surface-level small talk.',
      icon: MessageSquareHeart,
    },
    {
      title: 'Encouraging Support',
      desc: 'Connect with a global community invested in intentional personal responsibility.',
      icon: Sparkles,
    },
    {
      title: 'Mutual Accountability',
      desc: 'Stay anchored with small sub-groups that encourage consistent follow-through.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="community" className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <FadeUp>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100">
              COHORT COMMUNITY
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Growth is personal.{' '}
              <span className="text-blue-600">It doesn’t have to be lonely.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Surround yourself with people who take intentional living seriously. Time Trade brings together a cohort of committed participants growing together.
            </p>
          </FadeUp>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communityPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-subtle transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Community Atmosphere Banner */}
        <FadeUp delay={0.4}>
          <div className="p-8 sm:p-10 rounded-3xl bg-blue-50 border border-blue-100 text-center max-w-3xl mx-auto space-y-2">
            <h4 className="text-lg font-bold text-slate-900">
              Authentic Community • No Pretense
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our community space focuses on honest progress, mutual respect, and thoughtful dialogue rather than performative perfection.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
