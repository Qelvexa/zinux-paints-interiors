import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Facebook, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { getWhatsAppUrl } from '../lib/constants';
import { freshImageUrl } from '../lib/cacheSync';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();

  const phoneDisplay = settings.phone_display || '+234 803 212 4315';
  const email = settings.email || 'tosola87@gmail.com';
  const instagram = settings.instagram || '@zinuxpaints_interior';
  const facebook = settings.facebook || 'Zinux Paints and Agro Allied Product';

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Banner inside Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shrink-0">
                {settings.logo_url ? (
                  <img src={freshImageUrl(settings.logo_url)} alt={settings.business_name} className="w-8 h-8 object-contain" />
                ) : (
                  <svg viewBox="0 0 40 40" className="w-7 h-7 fill-none">
                    <path d="M6 22 L20 10 L34 22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 24 L20 17 L28 24" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 28 L20 24 L24 28" fill="#DC2626" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white flex items-center">
                  Zinux
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block ml-1"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Paints &amp; Interior
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {settings.hero_subtext || 'Professional painting, POP & interior finishing, and solar installation for homes, businesses and other spaces.'}
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span>Quality Finishing • Better Spaces • Reliable Power</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={`https://instagram.com/${instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/search/top?q=Zinux%20Paints%20and%20Agro%20Allied%20Product"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 hover:border-slate-700 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services#painting" className="hover:text-white transition-colors">
                  Painting (Interior &amp; Exterior)
                </Link>
              </li>
              <li>
                <Link to="/services#pop" className="hover:text-white transition-colors">
                  POP &amp; Interior Finishing
                </Link>
              </li>
              <li>
                <Link to="/services#solar" className="hover:text-white transition-colors">
                  Solar Installation
                </Link>
              </li>
              <li>
                <Link to="/paints" className="hover:text-white transition-colors">
                  Zinux Paint Products
                </Link>
              </li>
              <li>
                <Link to="/quote" className="text-red-400 hover:text-red-300 font-medium inline-flex items-center gap-1 transition-colors">
                  <span>Get Free Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">
                  Project Gallery
                </Link>
              </li>
              <li>
                <Link to="/paints" className="hover:text-white transition-colors">
                  Paints Catalogue
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Direct Contact
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-slate-300 hover:text-white transition-colors group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-xs text-slate-500 font-medium">WhatsApp / Call</span>
                  <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {phoneDisplay}
                  </span>
                </div>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-start gap-2.5 text-slate-300 hover:text-white transition-colors group"
              >
                <Mail className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-xs text-slate-500 font-medium">Official Email</span>
                  <span className="font-medium text-white group-hover:text-red-400 transition-colors break-all">
                    {email}
                  </span>
                </div>
              </a>

              <div className="pt-2 space-y-1 text-xs text-slate-400">
                <p>
                  <strong className="text-slate-300">Instagram:</strong> {instagram}
                </p>
                <p>
                  <strong className="text-slate-300">Facebook:</strong> {facebook}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Legal & Bottom Bar with Privacy, Terms, and Cookie Policy */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 sm:gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {settings.business_name || 'Zinux Paints & Interior'}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookie" className="hover:text-slate-400 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
