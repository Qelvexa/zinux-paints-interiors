import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

export const TermsPage: React.FC = () => {
  const { settings } = useSiteSettings();
  const [title, setTitle] = useState('Terms of Service');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/legal?slug=terms')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setTitle(data.title || 'Terms of Service');
          setContent(data.content || '');
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 lg:p-12 shadow-sm space-y-5 sm:space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
          <p className="text-xs text-slate-400">Last updated: September 2026</p>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading terms content...</div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed space-y-4">
              {content}
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 text-xs text-slate-500">
            <p><strong>Business:</strong> {settings.business_name}</p>
            <p><strong>Contact:</strong> {settings.phone_display} • {settings.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
