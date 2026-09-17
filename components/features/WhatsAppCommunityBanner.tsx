import React from 'react';
import { MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export const WhatsAppCommunityBanner: React.FC = () => {
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-950/80 via-navy-900 to-navy-950 border border-emerald-500/30 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> WhatsApp Community Layer
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Connect with your 90-Day Growth Cohort
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Use WhatsApp for discussions, weekly thought contributions, sermon debriefs, and real-time encouragement. The website handles your measurement & task tracking.
            </p>
          </div>
        </div>

        <a
          href="https://chat.whatsapp.com/demo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="gold" size="md" className="whitespace-nowrap flex items-center gap-2">
            Open WhatsApp Group <ArrowRight className="w-4 h-4" />
          </Button>
        </a>
      </div>
    </div>
  );
};
