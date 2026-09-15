import React, { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { getWhatsAppUrl } from '../lib/constants';
import { Link } from 'react-router-dom';
import { apiFetch, subscribeToContentUpdates } from '../lib/cacheSync';

export const ProjectsPage: React.FC = () => {
  const { getPageContent, isReady } = useSiteSettings();
  const c = getPageContent('projects');

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const headerBadge = c.header_badge || 'Verified Showcase';
  const headerTitle = c.header_title || 'Project Gallery';
  const headerSubtitle = c.header_subtitle || 'A comprehensive look at our completed painting, POP finishing, and solar power installations.';
  const calloutTitle = c.callout_title || 'Have a space you want transformed?';
  const calloutDesc = c.callout_desc || 'Contact us directly on WhatsApp or submit a quote request.';

  const fetchProjects = useCallback(async () => {
    try {
      const res = await apiFetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        const published = Array.isArray(data) ? data.filter((p: Project) => p.is_published !== false) : [];
        setProjects(published);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();

    const unsubscribe = subscribeToContentUpdates(() => {
      fetchProjects();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchProjects]);

  const categories = ['All', 'Painting', 'POP & Interior', 'Solar', 'Zinux Paints'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => {
        if (selectedCategory === 'Painting') return p.category.toLowerCase().includes('paint') && !p.category.toLowerCase().includes('bucket');
        if (selectedCategory === 'POP & Interior') return p.category.toLowerCase().includes('pop') || p.category.toLowerCase().includes('interior');
        if (selectedCategory === 'Solar') return p.category.toLowerCase().includes('solar');
        if (selectedCategory === 'Zinux Paints') return p.category.toLowerCase().includes('paint') || p.title.toLowerCase().includes('zinux');
        return true;
      });

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
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

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-red-600/30'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-600 text-sm">No projects found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={(p) => setSelectedProject(p)}
              />
            ))}
          </div>
        )}

        {/* Bottom Contact Callout */}
        <div className="mt-12 sm:mt-20 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{calloutTitle}</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              {calloutDesc}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Link
              to="/quote"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow text-center"
            >
              Request a Quote
            </Link>
            <a
              href={getWhatsAppUrl('Hello Zinux Paints & Interior, I would like to get a quote for a project.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 text-center"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};
