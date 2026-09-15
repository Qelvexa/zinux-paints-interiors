import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { getWhatsAppUrl } from '../lib/constants';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { Service, Project } from '../types';
import { ServiceCard } from '../components/ServiceCard';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { PaintShowcaseBanner } from '../components/PaintShowcaseBanner';
import { ValueGuaranteeBar } from '../components/ValueGuaranteeBar';
import { apiFetch, subscribeToContentUpdates, freshImageUrl } from '../lib/cacheSync';

export const Home: React.FC = () => {
  const { settings, isReady } = useSiteSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch initial data from real Supabase endpoints with no-cache revalidation
  const fetchData = useCallback(async () => {
    try {
      const [servicesRes, projectsRes] = await Promise.all([
        apiFetch('/api/services'),
        apiFetch('/api/projects'),
      ]);

      if (servicesRes.ok) {
        const sData = await servicesRes.json();
        const pubServices = Array.isArray(sData) ? sData.filter((s: Service) => s.is_published !== false) : [];
        setServices(pubServices);
      }

      if (projectsRes.ok) {
        const pData = await projectsRes.json();
        const pubProjects = Array.isArray(pData) ? pData.filter((p: Project) => p.is_published !== false) : [];
        setProjects(pubProjects);
      }
    } catch (err) {
      console.error('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Revalidate live whenever admin updates content or tab becomes visible
    const unsubscribe = subscribeToContentUpdates(() => {
      fetchData();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchData]);

  // Filter projects by category tab
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => {
        if (selectedCategory === 'Painting') return p.category.toLowerCase().includes('paint');
        if (selectedCategory === 'POP & Interior') return p.category.toLowerCase().includes('pop') || p.category.toLowerCase().includes('interior');
        if (selectedCategory === 'Solar') return p.category.toLowerCase().includes('solar');
        return true;
      });

  const heroLine1 = settings.hero_headline_line1 || 'Quality Finishing.';
  const heroLine2 = settings.hero_headline_line2 || 'Better Spaces.';
  const heroLine3 = settings.hero_headline_line3 || 'Reliable Power.';
  const heroSubtext = settings.hero_subtext || 'Professional painting, POP & interior finishing, and solar installation for homes, businesses and other spaces.';
  const heroImageUrl = settings.hero_image_url || '/images/hero-interior.jpg';
  const ctaQuote = settings.cta_quote_text || 'Request a Quote';
  const ctaWhatsApp = settings.cta_whatsapp_text || 'Chat on WhatsApp';
  const servicesTitle = settings.services_section_title || 'What We Do';
  const servicesSubtitle = settings.services_section_subtitle || 'We provide high-quality painting, POP & interior finishing, and solar installation services to transform your space and give you lasting value.';
  const projectsTitle = settings.projects_section_title || 'Project Gallery';
  const projectsSubtitle = settings.projects_section_subtitle || 'A look at some of our completed projects. We take pride in delivering quality work, on time and to your satisfaction.';
  const ctaBannerTitle = settings.cta_banner_title || 'Get an Accurate Quote for Your Project';
  const ctaBannerDesc = settings.cta_banner_desc || 'Whether you need professional painting, modern POP ceiling installation, or dependable solar energy, Zinux is ready to deliver.';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* ======================================================== */}
      {/* HERO SECTION - REPRODUCED FAITHFULLY FROM DESIGN MOCKUP */}
      {/* ======================================================== */}
      <section className="relative bg-[#071325] text-white overflow-hidden border-b border-slate-800">
        
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071325] via-[#0b1c36] to-transparent z-10 pointer-events-none lg:w-3/5" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 py-8 sm:py-14 lg:py-20">
            
            {/* Left Hero Panel: Headline, description, action buttons */}
            <div className="lg:col-span-7 z-20 flex flex-col justify-center">
              {!isReady ? (
                /* Hero Loading Skeleton */
                <div className="space-y-4 max-w-xl animate-pulse">
                  <div className="h-4 w-40 bg-slate-800/80 rounded-full" />
                  <div className="space-y-3 py-2">
                    <div className="h-10 sm:h-12 w-4/5 bg-slate-800 rounded-xl" />
                    <div className="h-10 sm:h-12 w-3/5 bg-slate-800 rounded-xl" />
                    <div className="h-10 sm:h-12 w-2/3 bg-slate-800/80 rounded-xl" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-4 w-full bg-slate-800/60 rounded" />
                    <div className="h-4 w-4/5 bg-slate-800/60 rounded" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <div className="h-12 w-40 bg-slate-800 rounded-xl" />
                    <div className="h-12 w-40 bg-slate-800 rounded-xl" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Top subhead tag */}
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <span className="w-5 h-0.5 bg-red-600 rounded-full" />
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
                      {settings.business_name || 'Zinux Paints & Interior'}
                    </span>
                  </div>

                  {/* Approved Hero Headline: Quality Finishing. Better Spaces. Reliable Power. */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                    {heroLine1}
                    <br />
                    {heroLine2}
                    <br />
                    <span className="text-red-600 drop-shadow-sm">{heroLine3}</span>
                  </h1>

                  {/* Subtext description */}
                  <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                    {heroSubtext}
                  </p>

                  {/* CTAs matching mockup */}
                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <Link
                      to="/quote"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-red-900/40 transition-all active:scale-95 text-center"
                    >
                      <span>{ctaQuote}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <a
                      href={getWhatsAppUrl('Hello Zinux Paints & Interior, I would like to chat about a quote.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-4 bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-sm sm:text-base rounded-xl border border-slate-700 shadow transition-all text-center"
                    >
                      <MessageCircle className="w-5 h-5 text-emerald-400" />
                      <span>{ctaWhatsApp}</span>
                    </a>
                  </div>

                  {/* Mini trust factors under hero */}
                  <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 max-w-lg">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Verified Work</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Direct WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Authentic Paints</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Hero Image: Featuring modern finished interior from reference */}
            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end w-full">
              {!isReady ? (
                <div className="w-full h-72 sm:h-88 md:h-96 lg:h-[480px] rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
              ) : (
                <div className="image-container relative w-full h-72 sm:h-88 md:h-96 lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800/60 group bg-slate-950">
                  <img
                    src={freshImageUrl(heroImageUrl, '/images/hero-interior.jpg', settings.updated_at)}
                    alt="Zinux Paints & Interior modern ceiling and finishing showcase"
                    className="w-full h-full object-cover object-center block transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/hero-interior.jpg';
                    }}
                  />

                  {/* Floating badge bottom right matching design mockup */}
                  <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 bg-white/95 backdrop-blur-md text-slate-900 rounded-lg p-2.5 sm:p-4 shadow-xl border-l-4 border-red-600 flex items-center gap-2.5 sm:gap-3 max-w-[200px] sm:max-w-xs">
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                        Modern Interiors
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                        Beautiful Finishes
                      </p>
                    </div>
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* WHAT WE DO / OUR SERVICES SECTION                        */}
      {/* ======================================================== */}
      <section className="py-12 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header with red dash indicator */}
          <div className="max-w-2xl mb-8 sm:mb-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-1 bg-red-600 rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Our Services
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
              {servicesTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
              {servicesSubtitle}
            </p>
          </div>

          {/* 3 Services Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {loading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="h-64 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
              ))
            ) : (
              services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))
            )}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* OUR RECENT WORK / PROJECT GALLERY                        */}
      {/* ======================================================== */}
      <section className="py-12 sm:py-20 lg:py-24 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-5 sm:gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-1 bg-red-600 rounded-full" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Our Recent Work
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
                {projectsTitle}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
                {projectsSubtitle}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {['All', 'Painting', 'POP & Interior', 'Solar'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="aspect-[4/3] rounded-xl bg-slate-200 animate-pulse" />
              ))
            ) : filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-500">
                No projects found in this category.
              </div>
            ) : (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={(p) => setSelectedProject(p)}
                />
              ))
            )}
          </div>

          {/* View full projects page link */}
          <div className="mt-8 sm:mt-12 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 hover:border-slate-800 text-slate-900 text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all"
            >
              <span>View All Portfolio Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* ZINUX PAINTS PRODUCT SHOWCASE BANNER                     */}
      {/* ======================================================== */}
      <PaintShowcaseBanner />

      {/* ======================================================== */}
      {/* VALUE GUARANTEE BAR                                      */}
      {/* ======================================================== */}
      <ValueGuaranteeBar />

      {/* ======================================================== */}
      {/* CALL TO ACTION BANNER                                    */}
      {/* ======================================================== */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 text-white text-center relative overflow-hidden shadow-2xl border border-slate-800">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded-full">
                Ready to Upgrade Your Space?
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                {ctaBannerTitle}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {ctaBannerDesc}
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                <Link
                  to="/quote"
                  className="w-full sm:w-auto px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 text-center"
                >
                  {ctaQuote}
                </Link>
                <a
                  href={getWhatsAppUrl('Hello Zinux Paints & Interior, I would like to get a quote.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Modal for detail view */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

    </div>
  );
};
