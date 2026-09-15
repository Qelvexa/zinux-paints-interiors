import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gauge, Shield, Home } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { getWhatsAppUrl } from '../lib/constants';
import { freshImageUrl } from '../lib/cacheSync';

export const PaintShowcaseBanner: React.FC = () => {
  const { settings } = useSiteSettings();

  const bannerTitle = settings.paints_banner_title || 'High-Quality Paints for Lasting Beauty';
  const bannerDesc = settings.paints_banner_desc || 'Our premium paint products give your walls and ceilings a smooth, vibrant and durable finish.';
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white py-16 sm:py-20 lg:py-24 border-t border-slate-800">
      {/* Decorative dark background splash overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 100%)',
        }}
      />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-4 space-y-5 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="w-8 h-1 bg-red-600 rounded-full" />
              <span className="text-xs font-bold tracking-widest uppercase text-slate-300">
                Zinux Paints
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {bannerTitle}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {bannerDesc}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
              <Link
                to="/paints"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-red-900/30 transition-all text-center"
              >
                <span>Explore Our Paints</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={getWhatsAppUrl('Hello Zinux Paints & Interior, I would like to order Zinux Paints.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-semibold rounded-lg transition-all text-center"
              >
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Center Column: Big Paint Bucket Product Image */}
          <div className="lg:col-span-4 flex items-center justify-center py-4 lg:py-0 w-full">
            <div className="relative group w-full max-w-[240px] sm:max-w-[280px]">
              {/* Radial glow around bucket */}
              <div className="absolute -inset-4 bg-red-600/20 rounded-full blur-xl group-hover:bg-red-600/30 transition-all duration-500 pointer-events-none" />
              
              <div className="image-container relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 bg-slate-900 transition-transform duration-500 group-hover:scale-105">
                <img
                  src={freshImageUrl('/images/zinux-bucket-hero.jpg')}
                  alt="Zinux High Quality Paints - Classy Satin 20 Litres"
                  className="w-full h-full object-cover object-center block"
                  onError={(e) => {
                    // Fallback to project paint bucket crop or reference image if needed
                    (e.target as HTMLImageElement).src = '/images/project-paint-bucket.jpg';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: 3 Key Value Features matching mockup */}
          <div className="lg:col-span-4 space-y-3.5 sm:space-y-5">
            
            {/* Feature 1 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Gauge className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Smooth Finish</h4>
                <p className="text-sm text-slate-400 mt-0.5">Bright &amp; Long Lasting</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">High Coverage</h4>
                <p className="text-sm text-slate-400 mt-0.5">More Value for every litre</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Home className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Suitable for Walls &amp; Ceilings</h4>
                <p className="text-sm text-slate-400 mt-0.5">Homes, Offices, Commercial Spaces</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
