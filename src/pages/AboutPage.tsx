import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { getWhatsAppUrl } from '../lib/constants';
import { freshImageUrl } from '../lib/cacheSync';

export const AboutPage: React.FC = () => {
  const { settings, getPageContent, isReady } = useSiteSettings();
  const c = getPageContent('about');

  const badge = c.header_badge || 'About Us';
  const storyTitle = c.story_title || 'Crafting Spaces that Inspire and Power That Never Fails';
  const storyP1 = c.story_p1 || 'Zinux Paints & Interior is a professional finishing and installations firm specializing in high-grade painting, modern POP and interior architectural finishing, and efficient solar power installations for homes, offices, and commercial properties.';
  const storyP2 = c.story_p2 || 'We believe that every room deserves a clean, durable coat of paint and aesthetic architectural ceilings, paired with sustainable and reliable electricity to support modern living.';
  const commit1Title = c.commitment_1_title || 'Quality Finishing';
  const commit1Desc = c.commitment_1_desc || 'Neat lines, smooth surfaces, and long-lasting durability.';
  const commit2Title = c.commitment_2_title || 'Better Spaces';
  const commit2Desc = c.commitment_2_desc || 'Architectural POP designs and harmonious color palettes that elevate ambiance.';
  const commit3Title = c.commitment_3_title || 'Reliable Power';
  const commit3Desc = c.commitment_3_desc || 'Dependable solar and inverter installations for uninterrupted living and working.';
  const calloutTitle = c.callout_title || "Let's Discuss Your Next Space";
  const calloutDesc = c.callout_desc || 'Get in touch today for professional advice, paint recommendations, and a transparent quote.';

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
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
                  {badge}
                </span>
                <span className="w-8 h-1 bg-red-600 rounded-full" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                {settings.business_name || 'Zinux Paints & Interior'}
              </h1>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-medium">
                "{settings.hero_headline_line1} {settings.hero_headline_line2} {settings.hero_headline_line3}"
              </p>
            </>
          )}
        </div>

        {/* Story & Mission Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 lg:p-12 mb-10 sm:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-red-600">
                Our Commitment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {storyTitle}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {storyP1}
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {storyP2}
              </p>

              <div className="pt-2 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{commit1Title}</h4>
                    <p className="text-xs text-slate-500">{commit1Desc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{commit2Title}</h4>
                    <p className="text-xs text-slate-500">{commit2Desc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{commit3Title}</h4>
                    <p className="text-xs text-slate-500">{commit3Desc}</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="lg:col-span-5 w-full">
              <div className="image-container relative w-full h-72 sm:h-96 lg:h-[460px] rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-950">
                <img
                  src={freshImageUrl(c.about_image_url || settings.hero_image_url || '/images/hero-interior.jpg')}
                  alt="Zinux Interior Finishing"
                  className="absolute inset-0 w-full h-full object-cover object-center block"
                />
              </div>
            </div>

          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3 sm:mb-4">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">{settings.guarantee_1_title || 'Quality Work'}</h4>
            <p className="text-xs text-slate-600 mt-1">{settings.guarantee_1_desc || 'We deliver neat and lasting results using genuine, high-grade materials.'}</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 sm:mb-4">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">{settings.guarantee_2_title || 'On-Time Delivery'}</h4>
            <p className="text-xs text-slate-600 mt-1">{settings.guarantee_2_desc || 'Your time matters to us. We adhere strictly to scheduled deadlines.'}</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 sm:mb-4">
              <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">{settings.guarantee_3_title || 'Customer Focus'}</h4>
            <p className="text-xs text-slate-600 mt-1">{settings.guarantee_3_desc || 'Your satisfaction is our priority from first consultation to final handover.'}</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 sm:mb-4">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">{settings.guarantee_4_title || 'Easy Communication'}</h4>
            <p className="text-xs text-slate-600 mt-1">{settings.guarantee_4_desc || 'Direct accessibility via WhatsApp and phone.'}</p>
          </div>
        </div>

        {/* Action Callout */}
        <div className="text-center bg-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-slate-800">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-2.5 sm:mb-3">{calloutTitle}</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            {calloutDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/quote"
              className="px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow text-center"
            >
              Request a Quote
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow text-center"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
