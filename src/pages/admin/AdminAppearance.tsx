import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useSiteSettings, AppearanceSettings, defaultAppearance } from '../../contexts/SiteSettingsContext';
import { Palette, CheckCircle, AlertCircle, Loader2, Sparkles, RefreshCw } from 'lucide-react';

export const AdminAppearance: React.FC = () => {
  const { getToken } = useAdminAuth();
  const { appearance, refreshAppearance } = useSiteSettings();

  const [formData, setFormData] = useState<AppearanceSettings>(defaultAppearance);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (appearance) {
      setFormData(appearance);
    }
  }, [appearance]);

  const presets = [
    {
      name: 'Zinux Signature',
      primary_color: '#DC2626',
      primary_hover: '#B91C1C',
      navy_dark: '#071325',
      navy_surface: '#0B1B33',
      bg_light: '#F8FAFC',
    },
    {
      name: 'Royal Blue & Red',
      primary_color: '#E11D48',
      primary_hover: '#BE123C',
      navy_dark: '#0A192F',
      navy_surface: '#1E293B',
      bg_light: '#F1F5F9',
    },
    {
      name: 'Executive Dark',
      primary_color: '#C81E1E',
      primary_hover: '#9B1C1C',
      navy_dark: '#020617',
      navy_surface: '#0F172A',
      bg_light: '#F8FAFC',
    },
    {
      name: 'Deep Crimson & Slate',
      primary_color: '#B91C1C',
      primary_hover: '#991B1B',
      navy_dark: '#090D16',
      navy_surface: '#131D2E',
      bg_light: '#FAFAFA',
    },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setFormData((prev) => ({
      ...prev,
      primary_color: preset.primary_color,
      primary_hover: preset.primary_hover,
      navy_dark: preset.navy_dark,
      navy_surface: preset.navy_surface,
      bg_light: preset.bg_light,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const token = getToken();
      const res = await fetch('/api/appearance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update appearance settings');
      }

      setSuccess(true);
      await refreshAppearance();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving appearance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/10 text-red-600 text-xs font-bold rounded-full mb-2">
            <Palette className="w-3.5 h-3.5" />
            <span>Theme &amp; Visual Design</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Appearance &amp; Global Colors</h2>
          <p className="text-xs text-slate-500 mt-1">
            Safely customize primary accent colors, dark navy background tones, border curves, and global font scaling.
          </p>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Appearance settings saved and applied across the public website!</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Color Presets */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Quick Brand Color Presets</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="p-3 rounded-xl border border-slate-200 hover:border-slate-800 bg-slate-50 hover:bg-white text-left transition space-y-2 group"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: preset.primary_color }} />
                  <span className="w-4 h-4 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: preset.navy_dark }} />
                  <span className="w-4 h-4 rounded-full border border-slate-300 shadow-xs" style={{ backgroundColor: preset.bg_light }} />
                </div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition truncate">{preset.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Appearance Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Color Controls */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
                Primary Brand &amp; Background Palette
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                
                {/* Primary Color */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Primary Accent (Red)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Buttons, highlights, badges</p>
                </div>

                {/* Primary Hover Color */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Primary Hover</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primary_hover}
                      onChange={(e) => setFormData({ ...formData, primary_hover: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.primary_hover}
                      onChange={(e) => setFormData({ ...formData, primary_hover: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Interactive button hover tone</p>
                </div>

                {/* Dark Navy Background */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Hero &amp; Footer Navy</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.navy_dark}
                      onChange={(e) => setFormData({ ...formData, navy_dark: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.navy_dark}
                      onChange={(e) => setFormData({ ...formData, navy_dark: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Hero section and dark banners</p>
                </div>

              </div>
            </div>

            {/* Typography & Curves */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
                Typography Scale &amp; Geometry
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Global Font Scale</label>
                  <select
                    value={formData.font_scale}
                    onChange={(e) => setFormData({ ...formData, font_scale: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs bg-white text-slate-800"
                  >
                    <option value="75%">75% (Ultra Compact)</option>
                    <option value="80%">80% (Current Standard - Approved)</option>
                    <option value="85%">85% (Medium Compact)</option>
                    <option value="90%">90% (Comfortable)</option>
                    <option value="100%">100% (Default 16px)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">Controls global typography proportion across all devices.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Card Corner Radius</label>
                  <select
                    value={formData.border_radius}
                    onChange={(e) => setFormData({ ...formData, border_radius: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs bg-white text-slate-800"
                  >
                    <option value="0.5rem">Subtle (8px)</option>
                    <option value="0.75rem">Rounded (12px - Approved)</option>
                    <option value="1rem">Modern Smooth (16px)</option>
                    <option value="1.5rem">Curved Luxury (24px)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">Adjusts corner softness on cards and banners.</p>
                </div>

              </div>
            </div>

            {/* Live Preview Box */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Live Component Preview</span>
              <div
                className="p-6 rounded-2xl border text-white flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{ backgroundColor: formData.navy_dark }}
              >
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: formData.primary_color }}>
                    Preview Badge
                  </span>
                  <h4 className="text-lg font-black text-white">Quality Finishing. Better Spaces.</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-white text-xs font-bold rounded-lg shadow-sm"
                    style={{ backgroundColor: formData.primary_color }}
                  >
                    Request a Quote
                  </button>
                  <span
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-white/20 text-slate-200"
                    style={{ backgroundColor: formData.navy_surface }}
                  >
                    WhatsApp
                  </span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setFormData(defaultAppearance)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 text-xs font-semibold rounded-xl transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Palette className="w-4 h-4" />}
                <span>{saving ? 'Saving...' : 'Save Appearance Changes'}</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
