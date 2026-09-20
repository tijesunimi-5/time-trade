'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Compass, Clock, ShieldCheck } from 'lucide-react';
import { MagneticButton } from '../motion/MagneticButton';
import { RevealText } from '../motion/RevealText';
import { FadeUp } from '../motion/FadeUp';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50">
      {/* Abstract Floating Visual System Particles & Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[500px] bg-gradient-to-b from-blue-400/15 via-sky-200/20 to-transparent blur-3xl rounded-full" />
        
        {/* Floating Translucent Timeline Layers */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 2, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-[8%] w-64 h-64 rounded-3xl bg-white/40 border border-blue-100/60 backdrop-blur-sm hidden lg:block shadow-subtle-lg"
        />

        <motion.div
          animate={{
            y: [15, -15, 15],
            rotate: [0, -3, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-24 right-[8%] w-72 h-72 rounded-full bg-gradient-to-tr from-blue-50/60 to-white/80 border border-blue-200/50 backdrop-blur-sm hidden lg:block shadow-subtle-lg"
        />

        {/* Abstract Micro Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Eyebrow Label */}
        <FadeUp delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200/80 shadow-xs text-blue-700 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>90 DAYS • INTENTIONAL GROWTH</span>
          </div>
        </FadeUp>

        {/* Editorial Main Headline */}
        <div className="space-y-4">
          <RevealText
            text="You have 90 days. What will you do with them?"
            as="h1"
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] max-w-4xl mx-auto"
            delay={0.2}
          />

          <FadeUp delay={0.4}>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              A structured journey to reset your life, restart what matters, and refocus your energy.
            </p>
          </FadeUp>
        </div>

        {/* Call to Action Buttons */}
        <FadeUp delay={0.5}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <MagneticButton>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all group"
              >
                <span>Join the 90 Days</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>

            <MagneticButton>
              <a
                href="#journey"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 font-bold text-sm tracking-wide shadow-xs transition-colors"
              >
                <span>Explore the Journey</span>
              </a>
            </MagneticButton>
          </div>
        </FadeUp>

        {/* Key Feature Badges */}
        <FadeUp delay={0.6}>
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>90-Day Progression</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Reset • Restart • Refocus</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Community & Personal Responsibility</span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
