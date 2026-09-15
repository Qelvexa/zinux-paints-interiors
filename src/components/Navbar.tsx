import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, Menu, X, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { getWhatsAppUrl } from '../lib/constants';
import { freshImageUrl } from '../lib/cacheSync';

export const Navbar: React.FC = () => {
  const { settings } = useSiteSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Hidden 10-second logo press logic
  // "Keep the administrator entry hidden from normal navigation by pressing and holding the Zinux logo continuously for exactly 10 seconds, with no visible countdown, animation, or other indication. Successful completion navigates to /admin/login."
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);

  const startHold = () => {
    isHoldingRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (isHoldingRef.current) {
        // Exactly 10 seconds continuous hold completed
        navigate('/admin/login');
      }
    }, 10000);
  };

  const endHold = () => {
    isHoldingRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/projects' },
    { label: 'Paints', path: '/paints' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const phoneRaw = settings.phone_raw || '+2348032124315';
  const phoneDisplay = settings.phone_display || '+234 803 212 4315';
  const email = settings.email || 'tosola87@gmail.com';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all select-none">
      {/* Top micro bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <a 
              href={`tel:${phoneRaw}`} 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>{phoneDisplay}</span>
            </a>
            <a 
              href={`mailto:${email}`} 
              className="hover:text-white transition-colors"
            >
              {email}
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Painting • POP &amp; Interior Finishing • Solar Installation</span>
            <a 
              href={getWhatsAppUrl()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-400 font-medium hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Active</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo with 10-second hidden hold trigger */}
          <Link
            to="/"
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            onTouchCancel={endHold}
            onContextMenu={(e) => {
              if (isHoldingRef.current) e.preventDefault();
            }}
            className="flex items-center gap-2.5 sm:gap-3 group select-none cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 bg-slate-900 rounded-lg shadow-sm group-hover:scale-105 transition-transform shrink-0">
              {settings.logo_url ? (
                <img src={freshImageUrl(settings.logo_url)} alt={settings.business_name} className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
              ) : (
                <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8 fill-none">
                  <path d="M6 22 L20 10 L34 22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 24 L20 17 L28 24" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 28 L20 24 L24 28" fill="#DC2626" />
                </svg>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-slate-800 flex items-center">
                Zinux
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block ml-1"></span>
              </span>
              <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-600 -mt-1">
                Paints &amp; Interior
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'text-red-600 font-bold'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              to="/quote"
              className="inline-flex items-center justify-center px-4 py-2.5 text-xs lg:text-sm font-semibold text-slate-900 border border-slate-300 rounded-full hover:border-slate-800 hover:bg-slate-50 transition-all shadow-sm"
            >
              {settings.cta_quote_text || 'Request a Quote'}
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs lg:text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{settings.cta_whatsapp_text || 'WhatsApp Us'}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white bg-slate-900 rounded-full hover:bg-slate-800"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-md focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'text-red-600 bg-red-50/60 font-bold'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col space-y-2.5">
            <Link
              to="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 text-center text-sm font-semibold text-white bg-red-600 rounded-xl shadow hover:bg-red-700 transition"
            >
              <span>{settings.cta_quote_text || 'Request a Quote'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 text-center text-sm font-semibold text-white bg-slate-900 rounded-xl shadow hover:bg-slate-800 transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us: {phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
