import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { X, CheckCircle, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../lib/constants';
import { freshImageUrl } from '../lib/cacheSync';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (project) {
      setActiveImage(project.image_url);
    }
  }, [project]);

  if (!project) return null;

  const whatsappMessage = `Hello Zinux Paints & Interior, I am interested in work similar to your project: "${project.title}" (${project.category}).`;

  const galleryList = Array.isArray(project.gallery_images) && project.gallery_images.length > 0
    ? project.gallery_images
    : [project.image_url];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Project Main Image */}
        <div className="image-container relative aspect-video w-full bg-slate-950 overflow-hidden">
          <img
            src={freshImageUrl(activeImage || project.image_url)}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover object-center block transition-all duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded-md shadow">
              {project.category}
            </span>
          </div>
        </div>

        {/* Gallery Thumbnails if more than 1 image */}
        {galleryList.length > 1 && (
          <div className="p-3 bg-slate-900 flex gap-2 overflow-x-auto border-b border-slate-800">
            {galleryList.map((imgUrl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(imgUrl)}
                className={`image-container relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                  (activeImage || project.image_url) === imgUrl
                    ? 'border-red-600 scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={freshImageUrl(imgUrl)} alt="" className="absolute inset-0 w-full h-full object-cover object-center block" />
              </button>
            ))}
          </div>
        )}

        {/* Body content */}
        <div className="p-6 sm:p-8 space-y-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {project.title}
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Category: {project.category} • Client Type: {project.client_type}
            </p>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed">
            {project.description}
          </p>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{project.completion_time || 'Delivered to specifications'}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href={getWhatsAppUrl(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuss This Project</span>
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
