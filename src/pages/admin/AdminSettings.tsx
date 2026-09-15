import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { getToken } = useAdminAuth();
  const { settings, refreshSettings } = useSiteSettings();

  const [formData, setFormData] = useState({
    business_name: '',
    phone_display: '',
    phone_raw: '',
    whatsapp_number: '',
    email: '',
    instagram: '',
    facebook: '',
    logo_url: '',
    favicon_url: '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        business_name: settings.business_name || 'Zinux Paints & Interior',
        phone_display: settings.phone_display || '+234 803 212 4315',
        phone_raw: settings.phone_raw || '+2348032124315',
        whatsapp_number: settings.whatsapp_number || '2348032124315',
        email: settings.email || 'tosola87@gmail.com',
        instagram: settings.instagram || '@zinuxpaints_interior',
        facebook: settings.facebook || 'Zinux Paints and Agro Allied Product',
        logo_url: settings.logo_url || '',
        favicon_url: settings.favicon_url || '/favicon.svg',
      });
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const token = getToken();
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update settings');
      }

      setSuccess(true);
      await refreshSettings();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Business &amp; Brand Settings</h2>
          <p className="text-xs text-slate-500 mt-1">Configure business name, phone, WhatsApp, email, social links, and brand icons.</p>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Settings updated successfully! Public website updated.</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Phone Display *</label>
                <input
                  type="text"
                  required
                  value={formData.phone_display}
                  onChange={(e) => setFormData({ ...formData, phone_display: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Phone Raw (tel:) *</label>
                <input
                  type="text"
                  required
                  value={formData.phone_raw}
                  onChange={(e) => setFormData({ ...formData, phone_raw: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">WhatsApp Number *</label>
                <input
                  type="text"
                  required
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Instagram Handle</label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Facebook Page Name</label>
                <input
                  type="text"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <div>
                <ImageUploader
                  label="Custom Brand Logo"
                  value={formData.logo_url}
                  onChange={(url) => setFormData({ ...formData, logo_url: url })}
                  folder="branding"
                  aspectRatio="square"
                  helperText="Upload PNG, SVG, or WEBP logo (leave empty to use default SVG logo)"
                />
              </div>

              <div>
                <ImageUploader
                  label="Website Favicon"
                  value={formData.favicon_url}
                  onChange={(url) => setFormData({ ...formData, favicon_url: url })}
                  folder="branding"
                  aspectRatio="square"
                  helperText="Upload 32x32 or 64x64 SVG/PNG favicon"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>

          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
