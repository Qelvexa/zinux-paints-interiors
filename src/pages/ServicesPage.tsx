import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Paintbrush, Home as HomeIcon, Sun, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { Service } from '../types';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { getWhatsAppUrl } from '../lib/constants';
import { apiFetch, subscribeToContentUpdates, freshImageUrl } from '../lib/cacheSync';

export const ServicesPage: React.FC = () => {
  const { getPageContent, isReady } = useSiteSettings();
  const c = getPageContent('services');

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const headerBadge = c.header_badge || 'Our Expertise';
  const headerTitle = c.header_title || 'Professional Services';
  const headerSubtitle = c.header_subtitle || 'Delivering quality finishing, better spaces, and reliable power with precision, premium materials, and professional execution.';
  const processHeading = c.process_heading || 'Our Quality Commitment';
  const processSubheading = c.process_subheading || 'Every project follows our systematic approach for spotless execution.';
  const step1Title = c.step_1_title || 'Consultation';
  const step1Desc = c.step_1_desc || 'Understanding your space, requirements, and color/material preferences.';
  const step2Title = c.step_2_title || 'Accurate Estimate';
  const step2Desc = c.step_2_desc || 'Transparent breakdown with genuine materials and realistic scheduling.';
  const step3Title = c.step_3_title || 'Precise Execution';
  const step3Desc = c.step_3_desc || 'Professional application by experienced artisans using top-tier products.';
  const step4Title = c.step_4_title || 'Clean Handover';
  const step4Desc = c.step_4_desc || 'Thorough inspection and spotless space handover for your complete peace of mind.';

  const fetchServices = useCallback(async () => {
    try {
      const res = await apiFetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        const published = Array.isArray(data) ? data.filter((s: Service) => s.is_published !== false) : [];
        setServices(published);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();

    const unsubscribe = subscribeToContentUpdates(() => {
      fetchServices();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchServices]);

  const getIcon = (slug: string) => {
    if (slug === 'painting') return <Paintbrush className="w-8 h-8 text-red-600" />;
    if (slug === 'pop') return <HomeIcon className="w-8 h-8 text-blue-700" />;
    return <Sun className="w-8 h-8 text-amber-500" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          {!isReady ? (
            <div className="space-y-3 animate-pulse max-w-lg mx-auto py-2">
              <div className="h-4 w-28 bg-slate-200 rounded-full mx-auto" />
              <div className="h-10 w-64 bg-slate-200 rounded-xl mx-auto" />
              <div className="h-4 w-96 max-w-full bg-slate-200 rounded mx-auto" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                <span className="w-8 h-1 bg-red-600 rounded-full" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {headerBadge}
                </span>
                <span className="w-8 h-1 bg-red-600 rounded-full" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                {headerTitle}
              </h1>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
                {headerSubtitle}
              </p>
            </>
          )}
        </div>

        {/* Detailed Service Blocks */}
        <div className="space-y-10 sm:space-y-16">
          {loading ? (
            <div className="space-y-6 sm:space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 sm:h-80 bg-white rounded-3xl border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : (
            services.map((service, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div
                  id={service.slug}
                  key={service.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden scroll-mt-28"
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-12 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                    
                    {/* Content Column */}
                    <div className={`lg:col-span-7 p-6 sm:p-8 lg:p-12 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 sm:mb-6">
                        {getIcon(service.slug)}
                      </div>

                      <span className="text-xs font-bold uppercase tracking-widest text-red-600">
                        Service #{service.display_order}
                      </span>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                        {service.name}
                      </h2>

                      <p className="mt-3 sm:mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                        {service.full_desc || service.short_desc}
                      </p>

                      {/* Features bullet list */}
                      <div className="mt-5 sm:mt-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5 sm:mb-3">
                          What is included:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                          {service.features?.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                              <CheckCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                        <Link
                          to={`/quote?service=${encodeURIComponent(service.name)}`}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow transition text-center"
                        >
                          <span>Request Quote for {service.name}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a
                          href={getWhatsAppUrl(`Hello Zinux, I would like to inquire specifically about ${service.name}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition text-center"
                        >
                          <MessageCircle className="w-4 h-4 text-emerald-400" />
                          <span>WhatsApp Inquire</span>
                        </a>
                      </div>

                    </div>

                    {/* Image Column */}
                    <div className={`image-container lg:col-span-5 h-64 sm:h-80 lg:h-full min-h-[260px] sm:min-h-[340px] bg-slate-950 relative overflow-hidden ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <img
                        src={freshImageUrl(service.image_url)}
                        alt={service.name}
                        className="absolute inset-0 w-full h-full object-cover object-center block"
                      />
                      <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Process Guarantee Banner */}
        <div className="mt-20 bg-slate-900 rounded-3xl p-8 sm:p-12 text-white">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold">{processHeading}</h3>
            <p className="text-slate-400 text-sm mt-2">
              {processSubheading}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <span className="text-red-500 font-bold text-xl block mb-1">01</span>
              <h4 className="font-bold text-white text-base">{step1Title}</h4>
              <p className="text-xs text-slate-300 mt-1">{step1Desc}</p>
            </div>
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <span className="text-red-500 font-bold text-xl block mb-1">02</span>
              <h4 className="font-bold text-white text-base">{step2Title}</h4>
              <p className="text-xs text-slate-300 mt-1">{step2Desc}</p>
            </div>
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <span className="text-red-500 font-bold text-xl block mb-1">03</span>
              <h4 className="font-bold text-white text-base">{step3Title}</h4>
              <p className="text-xs text-slate-300 mt-1">{step3Desc}</p>
            </div>
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <span className="text-red-500 font-bold text-xl block mb-1">04</span>
              <h4 className="font-bold text-white text-base">{step4Title}</h4>
              <p className="text-xs text-slate-300 mt-1">{step4Desc}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
