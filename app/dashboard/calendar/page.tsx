'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { api } from '../../../services/api';
import { Calendar as CalendarIcon, ExternalLink, Sparkles } from 'lucide-react';

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getCalendarEvents()
      .then((res) => setEvents(res.events))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-65px)]">
      <Sidebar />
      <div className="flex-1 p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
        <div className="space-y-1">
          <Badge variant="cyan">90-Day Calendar</Badge>
          <h1 className="text-3xl font-black text-white">Challenge Schedule & Milestones</h1>
          <p className="text-xs text-slate-400">View past, present, and upcoming cohort events across 90 days</p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 glass-panel rounded-2xl">
            Loading 90-day calendar...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} variant="glass" className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-brand-cyan" />
                    {event.eventDate}
                  </span>
                  <Badge variant={event.pillar.toLowerCase() as any}>{event.pillar}</Badge>
                </div>
                <h3 className="text-lg font-bold text-white">{event.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{event.description}</p>
                {event.resourceUrl && (
                  <a
                    href={event.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-cyan hover:underline pt-2"
                  >
                    Join Event Link <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
