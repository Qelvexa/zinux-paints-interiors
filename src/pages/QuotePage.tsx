import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle, CheckCircle, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { BUSINESS_INFO, getWhatsAppUrl } from '../lib/constants';

export const QuotePage: React.FC = () => {
  const { getPageContent, isReady } = useSiteSettings();
  const c = getPageContent('quote');

  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || 'Painting';
  const initialPaint = searchParams.get('paint') || '';

  const headerBadge = c.header_badge || 'Clear & Transparent';
  const headerTitle = c.header_title || 'Request a Quote';
  const headerSubtitle = c.header_subtitle || 'Tell us about your painting, POP finishing, or solar installation requirements. We will prepare an accurate and realistic estimate.';
  const supportBoxTitle = c.support_box_title || 'Fast Quote Support';
  const supportBoxDesc = c.support_box_desc || 'Need immediate assistance? Connect with our team directly.';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    service: initialService,
    projectType: 'Residential',
    sizeEstimate: 'Standard (Whole House)',
    paintPreference: initialPaint,
    description: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const servicesList = [
    'Painting',
    'POP & Interior Finishing',
    'Solar Installation',
    'Paint Product Supply (Zinux Paints)'
  ];

  const projectTypes = [
    'Residential (Home / Apartment)',
    'Commercial (Office / Store / Plaza)',
    'Industrial / Warehouse',
    'New Construction'
  ];

  const sizeOptions = [
    '1 - 2 Rooms',
    'Full Flat / Apartment',
    'Duplex / Multi-storey Building',
    'Large Commercial Complex',
    'Custom Scope'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setErrorMsg('Please enter your full name and phone number.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          service: formData.service,
          project_type: formData.projectType,
          size_estimate: formData.sizeEstimate,
          paint_preference: formData.paintPreference,
          description: formData.description
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit quote request');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Quote submission error:', err);
      setErrorMsg(err.message || 'An error occurred. Please try again or reach out on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappPrefill = `Hello Zinux Paints & Interior, my name is ${formData.fullName || '[Your Name]'}. I would like a quote for ${formData.service} (${formData.projectType}, ${formData.sizeEstimate}). Description: ${formData.description || 'Please provide information.'}`;

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
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
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">
                {headerSubtitle}
              </p>
            </>
          )}
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Quote Request Received!
            </h3>

            <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. Your request for <strong className="text-slate-900">{formData.service}</strong> has been saved. We will review your project details and contact you via phone ({formData.phone}) promptly.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1.5 text-slate-700">
              <p><strong>Service:</strong> {formData.service}</p>
              <p><strong>Project Type:</strong> {formData.projectType}</p>
              <p><strong>Estimated Size:</strong> {formData.sizeEstimate}</p>
              {formData.description && <p><strong>Notes:</strong> {formData.description}</p>}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={getWhatsAppUrl(whatsappPrefill)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send via WhatsApp for Instant Response</span>
              </a>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    fullName: '',
                    phone: '',
                    email: '',
                    service: 'Painting',
                    projectType: 'Residential',
                    sizeEstimate: 'Standard (Whole House)',
                    paintPreference: '',
                    description: ''
                  });
                }}
                className="w-full sm:w-auto px-6 py-3.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            
            {/* Quick top bar info */}
            <div className="bg-slate-900 text-white p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold">{supportBoxTitle}</h3>
                <p className="text-xs text-slate-300 mt-1">{supportBoxDesc}</p>
              </div>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition self-stretch sm:self-auto text-center"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp: {BUSINESS_INFO.phoneDisplay}</span>
              </a>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-8 lg:p-10 space-y-5 sm:space-y-6">
              
              {errorMsg && (
                <div className="p-3.5 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Service *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {servicesList.map((srv) => (
                    <button
                      type="button"
                      key={srv}
                      onClick={() => setFormData({ ...formData, service: srv })}
                      className={`p-3 sm:p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                        formData.service === srv
                          ? 'border-red-600 bg-red-50/60 text-red-900 font-bold ring-2 ring-red-600/20'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {srv}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Type & Size Estimates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                    Project Type
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                  >
                    {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                    Size / Scale Estimate
                  </label>
                  <select
                    value={formData.sizeEstimate}
                    onChange={(e) => setFormData({ ...formData, sizeEstimate: e.target.value })}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                  >
                    {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Paint preference if applicable */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                  Paint Product or Finish Preference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zinux Classy Satin, Emulsion, Textured Texcote, or Not Sure"
                  value={formData.paintPreference}
                  onChange={(e) => setFormData({ ...formData, paintPreference: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                />
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6 pt-1">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0803 212 4315"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                  Project Details / Location Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us what you would like completed (e.g. 4-bedroom duplex exterior painting, POP ceiling with cove lighting, solar power backup system...)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No obligation estimate • Prompt response</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>{submitting ? 'Submitting...' : 'Submit Quote Request'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
