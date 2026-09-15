import React from 'react';
import { Project } from '../types';
import { ArrowRight, Eye } from 'lucide-react';
import { freshImageUrl } from '../lib/cacheSync';

interface ProjectCardProps {
  project: Project;
  onSelect?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect && onSelect(project)}
      className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200/20 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Aspect ratio container */}
      <div className="image-container relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={freshImageUrl(project.image_url)}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover object-center block transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Dark subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Category tag */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase bg-slate-900/80 backdrop-blur-md text-white rounded-md border border-white/10">
            {project.category}
          </span>
        </div>

        {/* View overlay icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
            <Eye className="w-4 h-4" />
          </span>
        </div>

        {/* Bottom card content overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between text-white">
          <div>
            <h4 className="text-base font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
              {project.title}
            </h4>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
              {project.description}
            </p>
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-800/80 group-hover:bg-red-600 flex items-center justify-center shrink-0 ml-3 transition-colors">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
