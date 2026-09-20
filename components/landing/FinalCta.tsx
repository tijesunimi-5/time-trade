'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MagneticButton } from '../motion/MagneticButton';
import { FadeUp } from '../motion/FadeUp';

export const FinalCta: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-blue-600/15 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <FadeUp>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>90 DAYS • INTENTIONAL GROWTH</span>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Give the next 90 days <br className="hidden sm:inline" />
            <span className="text-blue-400">a purpose.</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            You don’t need to have everything figured out. You just need to be willing to begin.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <MagneticButton>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all group"
              >
                <span>Join the 90 Days</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>

            <MagneticButton>
              <a
                href="#journey"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm tracking-wide transition-colors"
              >
                <span>Explore the Journey</span>
              </a>
            </MagneticButton>
          </div>
        </FadeUp>

        <FadeUp delay={0.4}>
          <p className="text-xs text-slate-400 pt-6 font-medium">
            Passwordless email registration • No hidden fees • Complete participant privacy
          </p>
        </FadeUp>
      </div>
    </section>
  );
};
