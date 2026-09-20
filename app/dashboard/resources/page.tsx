'use client';

import React from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { BookOpen, ExternalLink, FileText, Video, Headphones } from 'lucide-react';

export default function ResourcesPage() {
  const resources = [
    {
      title: 'Daniel Chapter 1-2 Study Guide',
      pillar: 'SPIRITUAL',
      type: 'PDF Document',
      icon: FileText,
      url: 'https://www.biblegateway.com/passage/?search=Daniel+1&version=NIV',
      desc: 'Principles of standing resolute in a high-pressure environment without compromising personal convictions.',
    },
    {
      title: 'The Psychology of Money (Audiobook Summary)',
      pillar: 'MENTAL',
      type: 'Audio Podcast',
      icon: Headphones,
      url: 'https://open.spotify.com',
      desc: 'Understanding how emotions and habits govern wealth accumulation more than technical intelligence.',
    },
    {
      title: 'Emotional Intelligence & Stress Control',
      pillar: 'MENTAL',
      type: 'Video Masterclass',
      icon: Video,
      url: 'https://youtube.com',
      desc: 'Practical frameworks for regulating impulsive emotional reactions during business and personal decisions.',
    },
    {
      title: 'Cohort Community Protocol & WhatsApp Rules',
      pillar: 'SOCIAL',
      type: 'Guide',
      icon: BookOpen,
      url: 'https://chat.whatsapp.com/demo',
      desc: 'Guidelines for active contribution, weekly thought sharing, and respectful peer support.',
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        <div className="space-y-1">
          <Badge variant="cyan">Challenge Library</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Curated Growth Resources</h1>
          <p className="text-xs text-slate-500">Assigned reading, podcasts, videos, and study guides for the 90-day challenge</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {resources.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} variant="glass" className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={item.pillar.toLowerCase() as any}>{item.pillar}</Badge>
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Icon className="w-3.5 h-3.5 text-brand-600" />
                    {item.type}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline pt-1"
                >
                  Open Resource <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
