'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { api } from '../../../services/api';
import { Calendar as CalendarIcon, ExternalLink } from 'lucide-react';

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
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        <div className="space-y-1">
          <Badge variant="cyan">90-Day Calendar</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Challenge Schedule & Milestones</h1>
          <p className="text-xs text-slate-500">View past, present, and upcoming cohort events across 90 days</p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500 glass-panel rounded-2xl">
            Loading 90-day calendar...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {events.map((event) => (
              <Card key={event.id} variant="glass" className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-brand-600" />
                    {event.eventDate}
                  </span>
                  <Badge variant={event.pillar.toLowerCase() as any}>{event.pillar}</Badge>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">{event.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
                {event.resourceUrl && (
                  <a
                    href={event.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline pt-2"
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
