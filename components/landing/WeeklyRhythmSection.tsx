'use client';

import React from 'react';
import { Calendar, Sun, BookOpen, MessageSquare, Edit } from 'lucide-react';
import { FadeUp } from '../motion/FadeUp';

export const WeeklyRhythmSection: React.FC = () => {
  const schedule = [
    {
      days: 'MON – SAT',
      title: 'Spiritual Quiet Time',
      desc: 'Morning prayer, solitude & scriptural reflection',
      icon: Sun,
      highlight: false,
    },
    {
      days: 'DAILY',
      title: 'Personal Growth Action',
      desc: 'Executing your daily non-negotiable habits',
      icon: Calendar,
      highlight: false,
    },
    {
      days: 'WEEKLY',
      title: 'Curated Resource',
      desc: 'Selected book chapter, podcast, or sermon',
      icon: BookOpen,
      highlight: true,
    },
    {
      days: 'WEDNESDAY',
      title: 'Community Dialogue',
      desc: 'Mid-week cohort discussion & reflection',
      icon: MessageSquare,
      highlight: false,
    },
    {
      days: 'SATURDAY',
      title: 'Deep Reflection',
      desc: 'Weekly audit & personal growth ledger',
      icon: Edit,
      highlight: true,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <FadeUp>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100">
              SIMPLE WEEKLY RHYTHM
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              A rhythm built for <span className="text-blue-600">real life.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              We focus on steady consistency rather than rigid perfection. Here is how a typical week flows in Time Trade.
            </p>
          </FadeUp>
        </div>

        {/* Schedule Rhythm Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {schedule.map((item, idx) => {
            const Icon = item.icon;
            return (
              <FadeUp key={item.title} delay={idx * 0.1}>
                <div
                  className={`p-6 rounded-2xl h-full flex flex-col justify-between border transition-all ${
                    item.highlight
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-50 text-slate-900 border-slate-200/80 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md inline-block ${
                        item.highlight ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.days}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.highlight ? 'bg-white/20 text-white' : 'bg-white text-blue-600 shadow-xs'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-extrabold">{item.title}</h3>
                    <p
                      className={`text-xs leading-relaxed ${
                        item.highlight ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
};
