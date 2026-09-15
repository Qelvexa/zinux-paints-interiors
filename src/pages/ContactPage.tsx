import React, { useState } from 'react';
import { Mail, Instagram, Facebook, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { BUSINESS_INFO, getWhatsAppUrl } from '../lib/constants';

export const ContactPage: React.FC = () => {
  const { settings, getPageContent, isReady } = useSiteSettings();
  const c = getPageContent('contact');

  const headerBadge = c.header_badge || 'Get in Touch';
  const headerTitle = c.header_title || `Contact ${settings.business_name || 'Zinux Paints & Interior'}`;
  const headerSubtitle = c.header_subtitle || 'Reach out directly for project inquiries, paint orders, or technical consultations.';
  const formHeading = c.form_heading || 'Send Us a Message';
  const formSubtitle = c.form_subtitle || 'Fill out the form below and we will respond as soon as possible.';

  const phoneRaw = settings.phone_raw || BUSINESS_INFO.phoneRaw;
  const phoneDisplay = settings.phone_display || BUSINESS_INFO.phoneDisplay;
  const email = settings.email || BUSINESS_INFO.email;
  const instagram = settings.instagram || BUSINESS_INFO.instagram;
  const facebook = settings.facebook || BUSINESS_INFO.facebook;
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMsg('Please enter your name, phone number, and message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to send message');
      }

      setSent(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong. Please reach out via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-20">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
          
          {/* Left Column: Direct Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            
            {/* Phone & WhatsApp Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Phone &amp; WhatsApp</h3>
              <p className="text-xs text-slate-500 mt-1">Direct line for calls and instant WhatsApp messaging.</p>
              
              <div className="mt-4 space-y-2">
                <a
                  href={`tel:${phoneRaw}`}
                  className="block text-base font-bold text-slate-900 hover:text-red-600 transition-colors"
                >
                  {phoneDisplay}
                </a>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Email Address</h3>
              <p className="text-xs text-slate-500 mt-1">Send us detailed specifications or official requests.</p>
              <a
                href={`mailto:${email}`}
                className="mt-3 block text-base font-bold text-slate-900 hover:text-red-600 transition-colors break-all"
              >
                {email}
              </a>
            </div>

            {/* Social Media Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Official Channels</h3>
              <div className="space-y-3 text-sm">
                <a
                  href={`https://instagram.com/${instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-700 hover:text-red-600 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-red-500" />
                  <span><strong>Instagram:</strong> {instagram}</span>
                </a>
                <a
                  href={BUSINESS_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-700 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <span><strong>Facebook:</strong> {facebook}</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-200/90 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {formHeading}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                {formSubtitle}
              </p>

              {sent ? (
                <div className="mt-6 sm:mt-8 p-6 sm:p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-emerald-900">Message Delivered!</h4>
                  <p className="text-xs sm:text-sm text-emerald-800">
                    Thank you, {formData.name}. We have received your message and will reach out via phone ({formData.phone}).
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setFormData({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });
                    }}
                    className="px-5 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
                  {errorMsg && (
                    <div className="p-3.5 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs sm:text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0803 212 4315"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
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

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Painting Service">Painting Service</option>
                        <option value="POP & Interior Finishing">POP &amp; Interior Finishing</option>
                        <option value="Solar Installation">Solar Installation</option>
                        <option value="Zinux Paints Purchase">Zinux Paints Purchase</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Write your message or inquiry here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
