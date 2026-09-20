'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';
import { FadeUp } from '../motion/FadeUp';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        '“The RESET phase made me realize how much of my daily routine was just reacting to noise. Having structured reflection prompts completely changed how I approach my mornings.”',
      author: 'Participant Reflection',
      cohort: 'Cohort Participant',
      focus: 'Mindset & Clarity',
    },
    {
      quote:
        '“Instead of setting vague resolutions, having non-negotiable daily tasks and a cohort sub-group kept me anchored for the first time in years.”',
      author: 'Cohort Member',
      cohort: 'Cohort Participant',
      focus: 'Consistency & Accountability',
    },
    {
      quote:
        '“The curated weekly resources meant I wasn’t overwhelming myself with books I wouldn’t finish. Every resource had a direct reflection assignment attached.”',
      author: 'Participant Insight',
      cohort: 'Cohort Participant',
      focus: 'Curated Growth',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <FadeUp>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 shadow-xs">
              PARTICIPANT REFLECTIONS
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Real stories of <span className="text-blue-600">intentional growth.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-base sm:text-lg text-slate-600">
              Reflections from participants who chose to give their 90 days a purpose.
            </p>
          </FadeUp>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-subtle-lg transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-blue-600">
                  <Quote className="w-8 h-8 opacity-40" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
                    {item.focus}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {item.quote}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900">{item.author}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{item.cohort}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
