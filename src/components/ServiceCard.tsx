import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Paintbrush, Home, Sun } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  // Select matching icon based on service slug or icon name
  const renderIcon = () => {
    if (service.slug === 'painting' || service.icon === 'paint-roller') {
      return (
        <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-5 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
          <Paintbrush className="w-6 h-6" />
        </div>
      );
    }
    if (service.slug === 'pop' || service.icon === 'home-interior') {
      return (
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 mb-5 group-hover:bg-blue-900 group-hover:text-white transition-colors duration-300">
          <Home className="w-6 h-6" />
        </div>
      );
    }
    // Solar
    return (
      <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
        <Sun className="w-6 h-6" />
      </div>
    );
  };

  return (
    <div className="group bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
      <div>
        {renderIcon()}
        
        <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-red-600 transition-colors">
          {service.name}
        </h3>

        <p className="text-slate-600 text-sm mt-3 leading-relaxed">
          {service.short_desc}
        </p>

        {service.features && service.features.length > 0 && (
          <ul className="mt-4 space-y-2 text-xs text-slate-500">
            {service.features.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100">
        <Link
          to={`/services#${service.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors"
        >
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
