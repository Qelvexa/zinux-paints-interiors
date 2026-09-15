import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const AdminSeo: React.FC = () => {
  const { getToken } = useAdminAuth();
  const [formData, setFormData] = useState({
    site_title: 'Zinux Paints & Interior | Quality Finishing. Better Spaces. Reliable Power.',
    meta_description: 'Professional painting, POP & interior finishing, and solar installation for homes, businesses and other spaces. Phone/WhatsApp: +234 803 212 4315.',
    keywords: 'Zinux Paints, POP ceiling, interior finishing, solar installation, house painting, Classy Satin paint',
    og_image: '/images/hero-interior.jpg',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/seo')
      .then(res => res.json())
      .then(data => {
        if (data && data.site_title) {
          setFormData({
            site_title: data.site_title,
            meta_description: data.meta_description || '',
            keywords: data.keywords || '',
            og_image: data.og_image || '/images/hero-interior.jpg',
          });
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const token = getToken();
      const res = await fetch('/api/seo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update SEO');
      }

      setSuccess(true);
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
          <h2 className="text-2xl font-bold text-slate-900">SEO &amp; Search Metadata</h2>
          <p className="text-xs text-slate-500 mt-1">Configure site title, meta description, search keywords, and social share image.</p>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>SEO settings persisted in database successfully!</span>
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
            
            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                Global Page Title (Meta Title) *
              </label>
              <input
                type="text"
                required
                value={formData.site_title}
                onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Recommended length: 50-60 characters.</p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                Meta Description *
              </label>
              <textarea
                rows={3}
                required
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Recommended length: 140-160 characters.</p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                Target Keywords
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Comma-separated terms relevant to painting, POP ceilings, and solar.</p>
            </div>

            <div>
              <ImageUploader
                label="OpenGraph Social Share Image"
                value={formData.og_image}
                onChange={(url) => setFormData({ ...formData, og_image: url })}
                folder="seo"
                aspectRatio="video"
                helperText="Upload 1200x630 JPG, PNG, or WEBP image for social previews"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save SEO Metadata'}</span>
            </button>

          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
