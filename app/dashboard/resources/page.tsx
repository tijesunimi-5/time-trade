'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Loader } from '../../../components/ui/Loader';
import { api } from '../../../services/api';
import { BookOpen, ExternalLink, Headphones, Video, FileText, Download, Mic } from 'lucide-react';

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setIsLoading(true);
      const res = await api.getPublicResources();
      if (res.resources) {
        setResources(res.resources);
      }
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const API_HOST = (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== '')
    ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '')
    : 'https://time-trade-backend.onrender.com';

  const getFullUrl = (url?: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    return `${API_HOST}${url}`;
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'PODCAST':
        return Headphones;
      case 'SERMON':
        return Mic;
      case 'VIDEO':
        return Video;
      case 'ARTICLE':
      case 'DOCUMENT':
        return FileText;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        <div className="space-y-1">
          <Badge variant="cyan">Challenge Library</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Curated Growth Resources</h1>
          <p className="text-xs text-slate-500">Assigned reading softcopies, podcasts, videos, and study guides for the 90-day challenge</p>
        </div>

        {isLoading ? (
          <Loader variant="card" text="Loading curated resources..." />
        ) : resources.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Curated Resources Available</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Assigned books, podcasts, study guides, and video masterclasses will appear here as your EXCO team adds them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {resources.map((item) => {
              const Icon = getResourceIcon(item.type);
              const directFileUrl = item.fileUrl;
              const directUrl = item.url;

              return (
                <Card key={item.id} variant="glass" className="space-y-3 sm:space-y-4 flex flex-col justify-between bg-white">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200">
                        {item.type}
                      </span>
                      {item.author && <span className="text-xs text-slate-500 font-medium">by {item.author}</span>}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{item.title}</h3>
                    {item.contentNotes && (
                      <p className="text-xs text-slate-600 leading-relaxed">{item.contentNotes}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                    {directFileUrl && (
                      <a
                        href={getFullUrl(directFileUrl)}
                        download={item.fileName || true}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Softcopy (PDF)
                      </a>
                    )}

                    {directUrl && (
                      <a
                        href={getFullUrl(directUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        <Icon className="w-3.5 h-3.5" /> Open Resource Link <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
