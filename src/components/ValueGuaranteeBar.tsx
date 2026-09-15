import React from 'react';
import { ShieldCheck, Clock, Users, Headphones, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { getWhatsAppUrl } from '../lib/constants';

export const ValueGuaranteeBar: React.FC = () => {
  const { settings } = useSiteSettings();

  const guarantees = [
    {
      icon: ShieldCheck,
      title: settings.guarantee_1_title || 'Quality Work',
      subtitle: settings.guarantee_1_desc || 'We deliver neat and lasting results.',
      iconColor: 'text-red-500'
    },
    {
      icon: Clock,
      title: settings.guarantee_2_title || 'On-Time Delivery',
      subtitle: settings.guarantee_2_desc || 'Your time matters to us.',
      iconColor: 'text-red-500'
    },
    {
      icon: Users,
      title: settings.guarantee_3_title || 'Customer Focus',
      subtitle: settings.guarantee_3_desc || 'Your satisfaction is our priority.',
      iconColor: 'text-red-500'
    },
    {
      icon: Headphones,
      title: settings.guarantee_4_title || 'Easy Communication',
      subtitle: settings.guarantee_4_desc || 'Reach us anytime.',
      iconColor: 'text-red-500'
    }
  ];

  return (
    <section className="bg-slate-950 text-white border-y border-slate-800 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          
          {/* Grid of 4 value propositions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full lg:w-auto flex-1">
            {guarantees.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <IconComp className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick WhatsApp Action pill matching design */}
          <div className="shrink-0 w-full lg:w-auto">
            <a
              href={getWhatsAppUrl('Hello Zinux Paints & Interior, I would like to consult with you.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
