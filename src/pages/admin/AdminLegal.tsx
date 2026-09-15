import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const AdminLegal: React.FC = () => {
  const { getToken } = useAdminAuth();
  const [selectedSlug, setSelectedSlug] = useState<'privacy' | 'terms' | 'cookie'>('privacy');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchPage = async (slug: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/legal?slug=${slug}`);
      const data = await res.json();
      if (data) {
        setTitle(data.title || '');
        setContent(data.content || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(selectedSlug);
  }, [selectedSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const token = getToken();
      const res = await fetch('/api/legal', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug: selectedSlug,
          title,
          content,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update legal content');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Legal Pages Management</h2>
          <p className="text-xs text-slate-500 mt-1">Edit persisted text for Privacy Policy, Terms of Service, and Cookie Policy.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setSelectedSlug('privacy')}
            className={`pb-3 text-xs font-bold transition border-b-2 ${
              selectedSlug === 'privacy' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setSelectedSlug('terms')}
            className={`pb-3 text-xs font-bold transition border-b-2 ${
              selectedSlug === 'terms' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setSelectedSlug('cookie')}
            className={`pb-3 text-xs font-bold transition border-b-2 ${
              selectedSlug === 'cookie' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500'
            }`}
          >
            Cookie Policy
          </button>
        </div>

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Legal page saved successfully in Supabase!</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading legal content...</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Page Content</label>
                <textarea
                  rows={14}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Saving...' : 'Save Legal Content'}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};
