import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BUSINESS_INFO } from '../lib/constants';
import { apiFetch, subscribeToContentUpdates, broadcastContentUpdate } from '../lib/cacheSync';

export interface SiteSettings {
  id: string;
  business_name: string;
  phone_display: string;
  phone_raw: string;
  whatsapp_number: string;
  email: string;
  instagram: string;
  facebook: string;
  hero_headline_line1: string;
  hero_headline_line2: string;
  hero_headline_line3: string;
  hero_subtext: string;
  hero_image_url: string;
  logo_url: string;
  favicon_url: string;
  cta_quote_text: string;
  cta_whatsapp_text: string;
  services_section_title: string;
  services_section_subtitle: string;
  projects_section_title: string;
  projects_section_subtitle: string;
  paints_banner_title: string;
  paints_banner_desc: string;
  guarantee_1_title: string;
  guarantee_1_desc: string;
  guarantee_2_title: string;
  guarantee_2_desc: string;
  guarantee_3_title: string;
  guarantee_3_desc: string;
  guarantee_4_title: string;
  guarantee_4_desc: string;
  cta_banner_title: string;
  cta_banner_desc: string;
  updated_at?: string;
}

export interface AppearanceSettings {
  id: string;
  primary_color: string;
  primary_hover: string;
  navy_dark: string;
  navy_surface: string;
  bg_light: string;
  border_radius: string;
  font_scale: string;
  updated_at?: string;
}

export const defaultAppearance: AppearanceSettings = {
  id: 'default',
  primary_color: '#DC2626',
  primary_hover: '#B91C1C',
  navy_dark: '#071325',
  navy_surface: '#0B1B33',
  bg_light: '#F8FAFC',
  border_radius: '0.75rem',
  font_scale: '80%',
};

const defaultSettings: SiteSettings = {
  id: 'default',
  business_name: BUSINESS_INFO.name,
  phone_display: BUSINESS_INFO.phoneDisplay,
  phone_raw: BUSINESS_INFO.phoneRaw,
  whatsapp_number: BUSINESS_INFO.whatsappNumber,
  email: BUSINESS_INFO.email,
  instagram: BUSINESS_INFO.instagram,
  facebook: BUSINESS_INFO.facebook,
  hero_headline_line1: 'Quality Finishing.',
  hero_headline_line2: 'Better Spaces.',
  hero_headline_line3: 'Reliable Power.',
  hero_subtext: BUSINESS_INFO.heroSubtext,
  hero_image_url: '/images/hero-interior.jpg',
  logo_url: '',
  favicon_url: '/favicon.svg',
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
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  appearance: AppearanceSettings;
  pageContent: Record<string, Record<string, any>>;
  loading: boolean;
  isReady: boolean;
  refreshSettings: () => Promise<void>;
  refreshAppearance: () => Promise<void>;
  refreshPageContent: (page?: string) => Promise<void>;
  getPageContent: (page: string, fallback?: Record<string, any>) => Record<string, any>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  appearance: defaultAppearance,
  pageContent: {},
  loading: true,
  isReady: false,
  refreshSettings: async () => {},
  refreshAppearance: async () => {},
  refreshPageContent: async () => {},
  getPageContent: () => ({}),
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [appearance, setAppearance] = useState<AppearanceSettings>(defaultAppearance);
  const [pageContent, setPageContent] = useState<Record<string, Record<string, any>>>({});
  const [loading, setLoading] = useState(true);

  const applyAppearanceStyles = (app: AppearanceSettings) => {
    try {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', app.primary_color || '#DC2626');
      root.style.setProperty('--color-primary-hover', app.primary_hover || '#B91C1C');
      root.style.setProperty('--color-navy-dark', app.navy_dark || '#071325');
      root.style.setProperty('--color-navy-surface', app.navy_surface || '#0B1B33');
      if (app.font_scale) {
        root.style.setProperty('font-size', app.font_scale, 'important');
      }
    } catch {
      // Safe fallback if styles cannot be applied
      void 0;
    }
  };

  const fetchSettings = useCallback(async () => {
    try {
      const res = await apiFetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data && data.business_name) {
          setSettings({
            ...defaultSettings,
            ...data,
          });
        }
      }
    } catch (err) {
      console.error('Failed to load site settings:', err);
    }
  }, []);

  const fetchAppearance = useCallback(async () => {
    try {
      const res = await apiFetch('/api/appearance');
      if (res.ok) {
        const data = await res.json();
        if (data && data.primary_color) {
          const merged = { ...defaultAppearance, ...data };
          setAppearance(merged);
          applyAppearanceStyles(merged);
        }
      }
    } catch (err) {
      console.error('Failed to load appearance:', err);
    }
  }, []);

  const fetchPageContent = useCallback(async (page?: string) => {
    try {
      const url = page ? `/api/page-content?page=${page}` : '/api/page-content';
      const res = await apiFetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const map: Record<string, Record<string, any>> = {};
          data.forEach((item) => {
            if (item.page_key) map[item.page_key] = item.content || {};
          });
          setPageContent((prev) => ({ ...prev, ...map }));
        } else if (data && data.page_key) {
          setPageContent((prev) => ({ ...prev, [data.page_key]: data.content || {} }));
        }
      }
    } catch (err) {
      console.error('Failed to load page content:', err);
    }
  }, []);

  const revalidateAll = useCallback(async () => {
    await Promise.all([fetchSettings(), fetchAppearance(), fetchPageContent()]);
    setLoading(false);
  }, [fetchSettings, fetchAppearance, fetchPageContent]);

  useEffect(() => {
    revalidateAll();

    // Subscribe to cross-tab, visibility, and window sync events
    const unsubscribe = subscribeToContentUpdates(() => {
      revalidateAll();
    });

    return () => {
      unsubscribe();
    };
  }, [revalidateAll]);

  const getPageContent = (page: string, fallback: Record<string, any> = {}) => {
    return pageContent[page] || fallback;
  };

  const handleRefreshSettings = useCallback(async () => {
    await fetchSettings();
    broadcastContentUpdate('settings');
  }, [fetchSettings]);

  const handleRefreshAppearance = useCallback(async () => {
    await fetchAppearance();
    broadcastContentUpdate('appearance');
  }, [fetchAppearance]);

  const handleRefreshPageContent = useCallback(async (page?: string) => {
    await fetchPageContent(page);
    broadcastContentUpdate('page-content');
  }, [fetchPageContent]);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        appearance,
        pageContent,
        loading,
        isReady: !loading,
        refreshSettings: handleRefreshSettings,
        refreshAppearance: handleRefreshAppearance,
        refreshPageContent: handleRefreshPageContent,
        getPageContent,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
