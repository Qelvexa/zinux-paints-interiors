import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Save, CheckCircle, AlertCircle, Loader2, Layout, Briefcase, Layers, ShoppingBag, Info, MessageSquare } from 'lucide-react';

export const AdminContent: React.FC = () => {
  const { getToken } = useAdminAuth();
  const { refreshSettings, refreshPageContent } = useSiteSettings();

  const [activeTab, setActiveTab] = useState<'home' | 'services_page' | 'projects_page' | 'paints_page' | 'about_page' | 'contact_quote'>('home');

  // Homepage Settings
  const [formData, setFormData] = useState({
    hero_headline_line1: 'Quality Finishing.',
    hero_headline_line2: 'Better Spaces.',
    hero_headline_line3: 'Reliable Power.',
    hero_subtext: '',
    hero_image_url: '',
    cta_quote_text: 'Request a Quote',
    cta_whatsapp_text: 'WhatsApp Us',
    services_section_title: 'What We Do',
    services_section_subtitle: 'We provide high-quality painting, POP & interior finishing, and solar installation services to transform your space and give you lasting value.',
    projects_section_title: 'Project Gallery',
    projects_section_subtitle: 'A look at some of our completed projects. We take pride in delivering quality work, on time and to your satisfaction.',
    paints_banner_title: 'High-Quality Paints for Lasting Beauty',
    paints_banner_desc: 'Our premium paint products give your walls and ceilings a smooth, vibrant and durable finish.',
    guarantee_1_title: 'Quality Work',
    guarantee_1_desc: 'We deliver neat and lasting results.',
    guarantee_2_title: 'On-Time Delivery',
    guarantee_2_desc: 'Your time matters to us.',
    guarantee_3_title: 'Customer Focus',
    guarantee_3_desc: 'Your satisfaction is our priority.',
    guarantee_4_title: 'Easy Communication',
    guarantee_4_desc: 'Reach us anytime.',
    cta_banner_title: 'Get an Accurate Quote for Your Project',
    cta_banner_desc: 'Whether you need professional painting, modern POP ceiling installation, or dependable solar energy, Zinux is ready to deliver.',
  });

  // Services Page Custom Content
  const [servicesContent, setServicesContent] = useState({
    header_badge: 'Our Expertise',
    header_title: 'Professional Services',
    header_subtitle: 'Delivering quality finishing, better spaces, and reliable power with precision, premium materials, and professional execution.',
    process_heading: 'Our Quality Commitment',
    process_subheading: 'Every project follows our systematic approach for spotless execution.',
    step_1_title: 'Consultation',
    step_1_desc: 'Understanding your space, requirements, and color/material preferences.',
    step_2_title: 'Accurate Estimate',
    step_2_desc: 'Transparent breakdown with genuine materials and realistic scheduling.',
    step_3_title: 'Precise Execution',
    step_3_desc: 'Professional application by experienced artisans using top-tier products.',
    step_4_title: 'Clean Handover',
    step_4_desc: 'Thorough inspection and spotless space handover for your complete peace of mind.',
  });

  // Projects Page Custom Content
  const [projectsContent, setProjectsContent] = useState({
    header_badge: 'Verified Showcase',
    header_title: 'Project Gallery',
    header_subtitle: 'A comprehensive look at our completed painting, POP finishing, and solar power installations.',
    callout_title: 'Have a space you want transformed?',
    callout_desc: 'Contact us directly on WhatsApp or submit a quote request.',
  });

  // Paints Page Custom Content
  const [paintsContent, setPaintsContent] = useState({
    header_badge: 'Premium Formulations',
    header_title: 'Zinux Paint Products',
    header_subtitle: 'High-quality paints manufactured for exceptional coverage, vibrant color retention, and lasting protection on walls and ceilings.',
    spotlight_title: 'Zinux Classy Satin (20 Litres)',
    spotlight_desc: 'Our flagship premium satin paint provides an ultra-smooth, wipeable sheen designed specifically for luxury living rooms, bedrooms, and prestigious commercial offices.',
    spotlight_image_url: '/images/zinux-bucket-hero.jpg',
    catalogue_heading: 'Complete Paint Range',
  });

  // About Page Custom Content
  const [aboutContent, setAboutContent] = useState({
    header_badge: 'About Us',
    story_title: 'Crafting Spaces that Inspire and Power That Never Fails',
    story_p1: 'Zinux Paints & Interior is a professional finishing and installations firm specializing in high-grade painting, modern POP and interior architectural finishing, and efficient solar power installations for homes, offices, and commercial properties.',
    story_p2: 'We believe that every room deserves a clean, durable coat of paint and aesthetic architectural ceilings, paired with sustainable and reliable electricity to support modern living.',
    about_image_url: '/images/hero-interior.jpg',
    commitment_1_title: 'Quality Finishing',
    commitment_1_desc: 'Neat lines, smooth surfaces, and long-lasting durability.',
    commitment_2_title: 'Better Spaces',
    commitment_2_desc: 'Architectural POP designs and harmonious color palettes that elevate ambiance.',
    commitment_3_title: 'Reliable Power',
    commitment_3_desc: 'Dependable solar and inverter installations for uninterrupted living and working.',
    callout_title: "Let's Discuss Your Next Space",
    callout_desc: 'Get in touch today for professional advice, paint recommendations, and a transparent quote.',
  });

  // Contact & Quote Custom Content
  const [contactQuoteContent, setContactQuoteContent] = useState({
    contact_header_badge: 'Get in Touch',
    contact_header_title: 'Contact Zinux Paints & Interior',
    contact_header_subtitle: 'Reach out directly for project inquiries, paint orders, or technical consultations.',
    contact_form_heading: 'Send Us a Message',
    contact_form_subtitle: 'Fill out the form below and we will respond as soon as possible.',
    quote_header_badge: 'Clear & Transparent',
    quote_header_title: 'Request a Quote',
    quote_header_subtitle: 'Tell us about your painting, POP finishing, or solar installation requirements. We will prepare an accurate and realistic estimate.',
    quote_support_box_title: 'Fast Quote Support',
    quote_support_box_desc: 'Need immediate assistance? Connect with our team directly.',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 1. Fetch site settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.business_name) {
          setFormData((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.error(err));

    // 2. Fetch page contents
    fetch('/api/page-content')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item.page_key === 'services' && item.content) setServicesContent((prev) => ({ ...prev, ...item.content }));
            if (item.page_key === 'projects' && item.content) setProjectsContent((prev) => ({ ...prev, ...item.content }));
            if (item.page_key === 'paints' && item.content) setPaintsContent((prev) => ({ ...prev, ...item.content }));
            if (item.page_key === 'about' && item.content) setAboutContent((prev) => ({ ...prev, ...item.content }));
            if (item.page_key === 'contact' && item.content) {
              setContactQuoteContent((prev) => ({
                ...prev,
                contact_header_badge: item.content.header_badge || prev.contact_header_badge,
                contact_header_title: item.content.header_title || prev.contact_header_title,
                contact_header_subtitle: item.content.header_subtitle || prev.contact_header_subtitle,
                contact_form_heading: item.content.form_heading || prev.contact_form_heading,
                contact_form_subtitle: item.content.form_subtitle || prev.contact_form_subtitle,
              }));
            }
            if (item.page_key === 'quote' && item.content) {
              setContactQuoteContent((prev) => ({
                ...prev,
                quote_header_badge: item.content.header_badge || prev.quote_header_badge,
                quote_header_title: item.content.header_title || prev.quote_header_title,
                quote_header_subtitle: item.content.header_subtitle || prev.quote_header_subtitle,
                quote_support_box_title: item.content.support_box_title || prev.quote_support_box_title,
                quote_support_box_desc: item.content.support_box_desc || prev.quote_support_box_desc,
              }));
            }
          });
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      // 1. Save site_settings
      const settingsRes = await fetch('/api/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });

      if (!settingsRes.ok) {
        const err = await settingsRes.json();
        throw new Error(err.error || 'Failed to update homepage settings');
      }

      // 2. Save page_content records in parallel
      await Promise.all([
        fetch('/api/page-content', {
          method: 'POST',
          headers,
          body: JSON.stringify({ page_key: 'services', content: servicesContent }),
        }),
        fetch('/api/page-content', {
          method: 'POST',
          headers,
          body: JSON.stringify({ page_key: 'projects', content: projectsContent }),
        }),
        fetch('/api/page-content', {
          method: 'POST',
          headers,
          body: JSON.stringify({ page_key: 'paints', content: paintsContent }),
        }),
        fetch('/api/page-content', {
          method: 'POST',
          headers,
          body: JSON.stringify({ page_key: 'about', content: aboutContent }),
        }),
        fetch('/api/page-content', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            page_key: 'contact',
            content: {
              header_badge: contactQuoteContent.contact_header_badge,
              header_title: contactQuoteContent.contact_header_title,
              header_subtitle: contactQuoteContent.contact_header_subtitle,
              form_heading: contactQuoteContent.contact_form_heading,
              form_subtitle: contactQuoteContent.contact_form_subtitle,
            },
          }),
        }),
        fetch('/api/page-content', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            page_key: 'quote',
            content: {
              header_badge: contactQuoteContent.quote_header_badge,
              header_title: contactQuoteContent.quote_header_title,
              header_subtitle: contactQuoteContent.quote_header_subtitle,
              support_box_title: contactQuoteContent.quote_support_box_title,
              support_box_desc: contactQuoteContent.quote_support_box_desc,
            },
          }),
        }),
      ]);

      setSuccess(true);
      await Promise.all([refreshSettings(), refreshPageContent()]);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Error updating content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Public Website Content Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Edit all visible text, headings, buttons, and media across every public page with persistent Supabase storage.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-bold pb-px">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 pb-3 px-3 transition border-b-2 whitespace-nowrap ${
              activeTab === 'home' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Homepage</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('services_page')}
            className={`flex items-center gap-1.5 pb-3 px-3 transition border-b-2 whitespace-nowrap ${
              activeTab === 'services_page' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Services Page</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('projects_page')}
            className={`flex items-center gap-1.5 pb-3 px-3 transition border-b-2 whitespace-nowrap ${
              activeTab === 'projects_page' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Projects Page</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('paints_page')}
            className={`flex items-center gap-1.5 pb-3 px-3 transition border-b-2 whitespace-nowrap ${
              activeTab === 'paints_page' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Paints Page</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('about_page')}
            className={`flex items-center gap-1.5 pb-3 px-3 transition border-b-2 whitespace-nowrap ${
              activeTab === 'about_page' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About Page</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact_quote')}
            className={`flex items-center gap-1.5 pb-3 px-3 transition border-b-2 whitespace-nowrap ${
              activeTab === 'contact_quote' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contact &amp; Quote</span>
          </button>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All public website copy and media saved successfully in Supabase!</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-800 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* 1. HOMEPAGE CONTENT */}
            {activeTab === 'home' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Hero Section
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Hero Line 1</label>
                      <input
                        type="text"
                        required
                        value={formData.hero_headline_line1}
                        onChange={(e) => setFormData({ ...formData, hero_headline_line1: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Hero Line 2</label>
                      <input
                        type="text"
                        required
                        value={formData.hero_headline_line2}
                        onChange={(e) => setFormData({ ...formData, hero_headline_line2: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Hero Line 3 (Red Accent)</label>
                      <input
                        type="text"
                        required
                        value={formData.hero_headline_line3}
                        onChange={(e) => setFormData({ ...formData, hero_headline_line3: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Hero Subtext Description</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.hero_subtext}
                    onChange={(e) => setFormData({ ...formData, hero_subtext: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <ImageUploader
                    label="Hero Showcase Image"
                    value={formData.hero_image_url}
                    onChange={(url) => setFormData({ ...formData, hero_image_url: url })}
                    folder="hero"
                    aspectRatio="video"
                    helperText="Upload local JPG, PNG, WEBP, or SVG image (up to 10MB)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Primary Button Label</label>
                    <input
                      type="text"
                      value={formData.cta_quote_text}
                      onChange={(e) => setFormData({ ...formData, cta_quote_text: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">WhatsApp Button Label</label>
                    <input
                      type="text"
                      value={formData.cta_whatsapp_text}
                      onChange={(e) => setFormData({ ...formData, cta_whatsapp_text: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Section headers */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Homepage Sections Headers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Services Section</span>
                      <input
                        type="text"
                        value={formData.services_section_title}
                        onChange={(e) => setFormData({ ...formData, services_section_title: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold"
                      />
                      <textarea
                        rows={2}
                        value={formData.services_section_subtitle}
                        onChange={(e) => setFormData({ ...formData, services_section_subtitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Projects Section</span>
                      <input
                        type="text"
                        value={formData.projects_section_title}
                        onChange={(e) => setFormData({ ...formData, projects_section_title: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold"
                      />
                      <textarea
                        rows={2}
                        value={formData.projects_section_subtitle}
                        onChange={(e) => setFormData({ ...formData, projects_section_subtitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Guarantees */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    4 Value Guarantees
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        value={formData.guarantee_1_title}
                        onChange={(e) => setFormData({ ...formData, guarantee_1_title: e.target.value })}
                        className="w-full font-bold text-xs p-1.5 bg-white border border-slate-300 rounded mb-1"
                      />
                      <input
                        type="text"
                        value={formData.guarantee_1_desc}
                        onChange={(e) => setFormData({ ...formData, guarantee_1_desc: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        value={formData.guarantee_2_title}
                        onChange={(e) => setFormData({ ...formData, guarantee_2_title: e.target.value })}
                        className="w-full font-bold text-xs p-1.5 bg-white border border-slate-300 rounded mb-1"
                      />
                      <input
                        type="text"
                        value={formData.guarantee_2_desc}
                        onChange={(e) => setFormData({ ...formData, guarantee_2_desc: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        value={formData.guarantee_3_title}
                        onChange={(e) => setFormData({ ...formData, guarantee_3_title: e.target.value })}
                        className="w-full font-bold text-xs p-1.5 bg-white border border-slate-300 rounded mb-1"
                      />
                      <input
                        type="text"
                        value={formData.guarantee_3_desc}
                        onChange={(e) => setFormData({ ...formData, guarantee_3_desc: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        value={formData.guarantee_4_title}
                        onChange={(e) => setFormData({ ...formData, guarantee_4_title: e.target.value })}
                        className="w-full font-bold text-xs p-1.5 bg-white border border-slate-300 rounded mb-1"
                      />
                      <input
                        type="text"
                        value={formData.guarantee_4_desc}
                        onChange={(e) => setFormData({ ...formData, guarantee_4_desc: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SERVICES PAGE CONTENT */}
            {activeTab === 'services_page' && (
              <div className="space-y-5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Services Page Header</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={servicesContent.header_badge}
                      onChange={(e) => setServicesContent({ ...servicesContent, header_badge: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Page Title</label>
                    <input
                      type="text"
                      value={servicesContent.header_title}
                      onChange={(e) => setServicesContent({ ...servicesContent, header_title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Header Subtitle</label>
                  <textarea
                    rows={2}
                    value={servicesContent.header_subtitle}
                    onChange={(e) => setServicesContent({ ...servicesContent, header_subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quality Process Steps</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-red-600">Step 01</span>
                      <input
                        type="text"
                        value={servicesContent.step_1_title}
                        onChange={(e) => setServicesContent({ ...servicesContent, step_1_title: e.target.value })}
                        className="w-full font-bold text-xs p-1.5 bg-white border border-slate-300 rounded mb-1"
                      />
                      <textarea
                        rows={2}
                        value={servicesContent.step_1_desc}
                        onChange={(e) => setServicesContent({ ...servicesContent, step_1_desc: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-red-600">Step 02</span>
                      <input
                        type="text"
                        value={servicesContent.step_2_title}
                        onChange={(e) => setServicesContent({ ...servicesContent, step_2_title: e.target.value })}
                        className="w-full font-bold text-xs p-1.5 bg-white border border-slate-300 rounded mb-1"
                      />
                      <textarea
                        rows={2}
                        value={servicesContent.step_2_desc}
                        onChange={(e) => setServicesContent({ ...servicesContent, step_2_desc: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-red-600">Step 03</span>
                      <input
                        type="text"
                        value={servicesContent.step_3_title}
                        onChange={(e) => setServicesContent({ ...servicesContent, step_3_title: e.target.value })}
                        className="w-full font-bold text-xs p-1.5 bg-white border border-slate-300 rounded mb-1"
                      />
                      <textarea
                        rows={2}
                        value={servicesContent.step_3_desc}
                        onChange={(e) => setServicesContent({ ...servicesContent, step_3_desc: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-red-600">Step 04</span>
                      <input
                        type="text"
                        value={servicesContent.step_4_title}
                        onChange={(e) => setServicesContent({ ...servicesContent, step_4_title: e.target.value })}
                        className="w-full font-bold text-xs p-1.5 bg-white border border-slate-300 rounded mb-1"
                      />
                      <textarea
                        rows={2}
                        value={servicesContent.step_4_desc}
                        onChange={(e) => setServicesContent({ ...servicesContent, step_4_desc: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PROJECTS PAGE CONTENT */}
            {activeTab === 'projects_page' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Projects Page Header &amp; Callout</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={projectsContent.header_badge}
                      onChange={(e) => setProjectsContent({ ...projectsContent, header_badge: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Page Title</label>
                    <input
                      type="text"
                      value={projectsContent.header_title}
                      onChange={(e) => setProjectsContent({ ...projectsContent, header_title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Header Subtitle</label>
                  <textarea
                    rows={2}
                    value={projectsContent.header_subtitle}
                    onChange={(e) => setProjectsContent({ ...projectsContent, header_subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Bottom Space Callout</h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Callout Title</label>
                    <input
                      type="text"
                      value={projectsContent.callout_title}
                      onChange={(e) => setProjectsContent({ ...projectsContent, callout_title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Callout Description</label>
                    <textarea
                      rows={2}
                      value={projectsContent.callout_desc}
                      onChange={(e) => setProjectsContent({ ...projectsContent, callout_desc: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. PAINTS PAGE CONTENT */}
            {activeTab === 'paints_page' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Paints Page Header &amp; Spotlight</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={paintsContent.header_badge}
                      onChange={(e) => setPaintsContent({ ...paintsContent, header_badge: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Page Title</label>
                    <input
                      type="text"
                      value={paintsContent.header_title}
                      onChange={(e) => setPaintsContent({ ...paintsContent, header_title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Header Subtitle</label>
                  <textarea
                    rows={2}
                    value={paintsContent.header_subtitle}
                    onChange={(e) => setPaintsContent({ ...paintsContent, header_subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Spotlight Signature Product</h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Spotlight Product Title</label>
                    <input
                      type="text"
                      value={paintsContent.spotlight_title}
                      onChange={(e) => setPaintsContent({ ...paintsContent, spotlight_title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Spotlight Product Description</label>
                    <textarea
                      rows={2}
                      value={paintsContent.spotlight_desc}
                      onChange={(e) => setPaintsContent({ ...paintsContent, spotlight_desc: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <ImageUploader
                      label="Spotlight Product Image"
                      value={paintsContent.spotlight_image_url}
                      onChange={(url) => setPaintsContent({ ...paintsContent, spotlight_image_url: url })}
                      folder="paints"
                      aspectRatio="square"
                      helperText="Upload featured 20L paint container photo"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. ABOUT PAGE CONTENT */}
            {activeTab === 'about_page' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">About Story &amp; Commitments</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Story Title</label>
                  <input
                    type="text"
                    value={aboutContent.story_title}
                    onChange={(e) => setAboutContent({ ...aboutContent, story_title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Story Paragraph 1</label>
                  <textarea
                    rows={2}
                    value={aboutContent.story_p1}
                    onChange={(e) => setAboutContent({ ...aboutContent, story_p1: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Story Paragraph 2</label>
                  <textarea
                    rows={2}
                    value={aboutContent.story_p2}
                    onChange={(e) => setAboutContent({ ...aboutContent, story_p2: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <ImageUploader
                    label="About Story Showcase Image"
                    value={aboutContent.about_image_url}
                    onChange={(url) => setAboutContent({ ...aboutContent, about_image_url: url })}
                    folder="about"
                    aspectRatio="video"
                    helperText="Upload image representing Zinux craftsmanship and spaces"
                  />
                </div>
                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-red-600">Commitment 1</span>
                    <input
                      type="text"
                      value={aboutContent.commitment_1_title}
                      onChange={(e) => setAboutContent({ ...aboutContent, commitment_1_title: e.target.value })}
                      className="w-full font-bold text-xs p-1.5 bg-white border border-slate-300 rounded mb-1"
                    />
                    <input
                      type="text"
                      value={aboutContent.commitment_1_desc}
                      onChange={(e) => setAboutContent({ ...aboutContent, commitment_1_desc: e.target.value })}
                      className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-red-600">Commitment 2</span>
                    <input
                      type="text"
                      value={aboutContent.commitment_2_title}
                      onChange={(e) => setAboutContent({ ...aboutContent, commitment_2_title: e.target.value })}
                      className="w-full font-bold text-xs p-1.5 bg-white border border-slate-300 rounded mb-1"
                    />
                    <input
                      type="text"
                      value={aboutContent.commitment_2_desc}
                      onChange={(e) => setAboutContent({ ...aboutContent, commitment_2_desc: e.target.value })}
                      className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-red-600">Commitment 3</span>
                    <input
                      type="text"
                      value={aboutContent.commitment_3_title}
                      onChange={(e) => setAboutContent({ ...aboutContent, commitment_3_title: e.target.value })}
                      className="w-full font-bold text-xs p-1.5 bg-white border border-slate-300 rounded mb-1"
                    />
                    <input
                      type="text"
                      value={aboutContent.commitment_3_desc}
                      onChange={(e) => setAboutContent({ ...aboutContent, commitment_3_desc: e.target.value })}
                      className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. CONTACT & QUOTE */}
            {activeTab === 'contact_quote' && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Contact Page Copy</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Badge</label>
                      <input
                        type="text"
                        value={contactQuoteContent.contact_header_badge}
                        onChange={(e) => setContactQuoteContent({ ...contactQuoteContent, contact_header_badge: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={contactQuoteContent.contact_header_title}
                        onChange={(e) => setContactQuoteContent({ ...contactQuoteContent, contact_header_title: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quote Page Copy</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Quote Badge</label>
                      <input
                        type="text"
                        value={contactQuoteContent.quote_header_badge}
                        onChange={(e) => setContactQuoteContent({ ...contactQuoteContent, quote_header_badge: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Quote Title</label>
                      <input
                        type="text"
                        value={contactQuoteContent.quote_header_title}
                        onChange={(e) => setContactQuoteContent({ ...contactQuoteContent, quote_header_title: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save All Website Content'}</span>
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
