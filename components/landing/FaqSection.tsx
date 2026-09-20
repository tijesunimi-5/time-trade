'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FadeUp } from '../motion/FadeUp';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is Your Time Trade?',
      a: 'Your Time Trade is a structured 90-day personal growth experience designed to help you pause, understand yourself, rebuild habits, and move forward with clarity across your spiritual, mental, and relational life.',
    },
    {
      q: 'Who is it for?',
      a: 'Primarily young adults who want to become more intentional, understand themselves better, build healthier habits, strengthen relationships, improve their financial mindset, and grow spiritually.',
    },
    {
      q: 'What happens during the 90 days?',
      a: 'The programme progresses through three 30-day phases: RESET (understanding your current state), RESTART (rebuilding healthier habits and practices), and REFOCUS (aligning long-term priorities).',
    },
    {
      q: 'Do I need to complete everything perfectly?',
      a: 'No. The programme emphasizes steady consistency and personal responsibility rather than rigid perfection. Growth happens through honest engagement, not flawless execution.',
    },
    {
      q: 'Is this a religious programme?',
      a: 'Your Time Trade integrates spiritual reflection (prayer and scriptural grounding) alongside mental discipline, emotional intelligence, financial literacy, and community accountability as holistic dimensions of growth.',
    },
    {
      q: 'How much time should I expect to commit daily?',
      a: 'Approximately 20 to 30 minutes per day for morning quiet time, personal growth tasks, and brief journal reflections, plus a weekly resource and cohort discussion.',
    },
    {
      q: 'What happens if I miss an activity?',
      a: 'Missing a task is an opportunity to reflect on friction points rather than feel guilt. Your non-negotiables reset daily, and your cohort sub-group encourages you to resume without friction.',
    },
    {
      q: 'How does accountability work?',
      a: 'Accountability is built around small cohort sub-groups and factual task check-offs. It provides supportive structure and encouragement to help you stay intentional.',
    },
    {
      q: 'What happens after 90 days?',
      a: 'By Day 90, you will have built sustainable personal systems, habit discipline, and long-term clarity that continue long after the structured programme ends.',
    },
  ];

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <FadeUp>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100">
              FREQUENTLY ASKED QUESTIONS
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to know.
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-base text-slate-600">
              Clear, transparent answers about the 90-day programme.
            </p>
          </FadeUp>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <FadeUp key={faq.q} delay={idx * 0.05}>
                <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-slate-900 text-base hover:text-blue-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 font-normal">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
};
