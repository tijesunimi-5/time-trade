import React from 'react';
import { MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export const WhatsAppCommunityBanner: React.FC = () => {
  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-emerald-50 via-white to-blue-50 border border-emerald-200/90 shadow-subtle-md relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative z-10">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> WhatsApp Community Layer
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Connect with your 90-Day Growth Cohort
            </h3>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              Use WhatsApp for discussions, weekly thought contributions, sermon debriefs, and real-time encouragement. The website handles your task tracking.
            </p>
          </div>
        </div>

        <a
          href="https://chat.whatsapp.com/J6AyDKAcY9N7B1QLyFtOVe"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto"
        >
          <Button variant="gold" size="md" className="w-full md:w-auto whitespace-nowrap flex items-center justify-center gap-2">
            Open WhatsApp Group <ArrowRight className="w-4 h-4" />
          </Button>
        </a>
      </div>
    </div>
  );
};
