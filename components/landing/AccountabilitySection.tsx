'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, HeartHandshake, Compass } from 'lucide-react';
import { FadeUp } from '../motion/FadeUp';

export const AccountabilitySection: React.FC = () => {
  const elements = [
    { title: 'Daily Non-Negotiables', desc: 'Small, unshakeable daily habits that anchor your growth.' },
    { title: 'Personal Growth Tasks', desc: 'Targeted actions built around your specific focus areas.' },
    { title: 'Weekly Reflections', desc: 'Honest weekly self-audits to evaluate progress.' },
    { title: 'Community Check-ins', desc: 'Subtle peer touchpoints that encourage steady follow-through.' },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <FadeUp>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 shadow-xs">
              PERSONAL RESPONSIBILITY
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Your growth is <span className="text-blue-600">yours to own.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Accountability in Time Trade is not about pressure or shaming. It is a structure designed to help you stay intentional when daily motivation fluctuates.
            </p>
          </FadeUp>
        </div>

        {/* Highlight Banner */}
        <FadeUp delay={0.3}>
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-subtle-lg space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 text-blue-600">
              <ShieldCheck className="w-8 h-8 shrink-0" />
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                A Structure Built for Intentionality
              </h3>
            </div>
            <blockquote className="text-base sm:text-lg text-slate-700 italic border-l-4 border-blue-600 pl-4 py-1">
              "Structure creates freedom. When daily actions are clear, your energy moves toward growth instead of decision fatigue."
            </blockquote>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              {elements.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
