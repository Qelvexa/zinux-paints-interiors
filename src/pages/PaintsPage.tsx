import React, { useState, useEffect, useCallback } from 'react';
import { PaintProduct } from '../types';
import { Sparkles, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { getWhatsAppUrl } from '../lib/constants';
import { Link } from 'react-router-dom';
import { apiFetch, subscribeToContentUpdates, freshImageUrl } from '../lib/cacheSync';

export const PaintsPage: React.FC = () => {
  const { getPageContent, isReady } = useSiteSettings();
  const c = getPageContent('paints');

  const [paints, setPaints] = useState<PaintProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const headerBadge = c.header_badge || 'Premium Formulations';
  const headerTitle = c.header_title || 'Zinux Paint Products';
  const headerSubtitle = c.header_subtitle || 'High-quality paints manufactured for exceptional coverage, vibrant color retention, and lasting protection on walls and ceilings.';
  const spotlightTitle = c.spotlight_title || 'Zinux Classy Satin (20 Litres)';
  const spotlightDesc = c.spotlight_desc || 'Our flagship premium satin paint provides an ultra-smooth, wipeable sheen designed specifically for luxury living rooms, bedrooms, and prestigious commercial offices.';
  const catalogueHeading = c.catalogue_heading || 'Complete Paint Range';

  const fetchPaints = useCallback(async () => {
    try {
      const res = await apiFetch('/api/paints');
      if (res.ok) {
        const data = await res.json();
        setPaints(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaints();

    const unsubscribe = subscribeToContentUpdates(() => {
      fetchPaints();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchPaints]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {!isReady ? (
            <div className="space-y-3 animate-pulse max-w-lg mx-auto py-2">
              <div className="h-4 w-28 bg-slate-200 rounded-full mx-auto" />
              <div className="h-10 w-64 bg-slate-200 rounded-xl mx-auto" />
              <div className="h-4 w-96 max-w-full bg-slate-200 rounded mx-auto" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="w-8 h-1 bg-red-600 rounded-full" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {headerBadge}
                </span>
                <span className="w-8 h-1 bg-red-600 rounded-full" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {headerTitle}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                {headerSubtitle}
              </p>
            </>
          )}
        </div>

        {/* Featured Hero Product Spotlight */}
        <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 p-6 sm:p-10 lg:p-12 mb-10 sm:mb-16 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            <div className="lg:col-span-5 flex justify-center py-2 sm:py-0 w-full">
              <div className="image-container relative w-full max-w-[220px] sm:max-w-xs aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 bg-slate-900">
                <img
                  src={freshImageUrl(c.spotlight_image_url || '/images/zinux-bucket-hero.jpg')}
                  alt="Zinux Classy Satin High Quality Paints"
                  className="w-full h-full object-cover object-center block"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/project-paint-bucket.jpg';
                  }}
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-full uppercase">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>Signature Product</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                {spotlightTitle}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {spotlightDesc}
              </p>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
                <div className="bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] sm:text-xs text-slate-400 block">Finish</span>
                  <span className="text-xs sm:text-sm font-bold text-white">Smooth Satin</span>
                </div>
                <div className="bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] sm:text-xs text-slate-400 block">Packaging</span>
                  <span className="text-xs sm:text-sm font-bold text-white">20L Drum</span>
                </div>
                <div className="bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] sm:text-xs text-slate-400 block">Coverage</span>
                  <span className="text-xs sm:text-sm font-bold text-white">High Yield</span>
                </div>
              </div>

              <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <a
                  href={getWhatsAppUrl('Hello Zinux Paints & Interior, I would like to order the Zinux Classy Satin 20L paint.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-center"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Order on WhatsApp</span>
                </a>
                <Link
                  to="/quote?product=Zinux+Classy+Satin"
                  className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow transition text-center"
                >
                  Request Bulk Quote
                </Link>
              </div>

            </div>

          </div>
        </div>

        {/* Full Paints Catalog Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">{catalogueHeading}</h3>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paints.map((paint) => (
                <div
                  key={paint.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group"
                >
                  <div className="image-container relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={freshImageUrl(paint.image_url || '/images/zinux-bucket-hero.jpg')}
                      alt={paint.name}
                      className="w-full h-full object-cover object-center block transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/project-paint-bucket.jpg';
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold uppercase tracking-wide text-red-600 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs">
                        {paint.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      {paint.popular && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase mb-2 inline-block">
                          Featured Formulation
                        </span>
                      )}

                      <h4 className="text-xl font-bold text-slate-900">{paint.name}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{paint.tagline}</p>
                      <p className="text-slate-600 text-sm mt-3 leading-relaxed">{paint.description}</p>

                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Finish:</span>
                          <span className="font-semibold text-slate-800">{paint.finish_type}</span>
                        </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Coverage:</span>
                        <span className="font-semibold text-slate-800">{paint.coverage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Drying Time:</span>
                        <span className="font-semibold text-slate-800">{paint.drying_time}</span>
                      </div>
                    </div>

                    {paint.features && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {paint.features.map((f, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-slate-100 px-2 py-1 rounded">
                            <Check className="w-3 h-3 text-red-600" />
                            <span>{f}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={getWhatsAppUrl(`Hello Zinux, I would like to order or ask about ${paint.name}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Order</span>
                    </a>

                    <Link
                      to={`/quote?paint=${encodeURIComponent(paint.name)}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                    >
                      <span>Quote</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

      </div>
    </div>
  );
};
