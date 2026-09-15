import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { PaintProduct } from '../../types';
import { broadcastContentUpdate } from '../../lib/cacheSync';
import { Plus, Edit2, Trash2, CheckCircle, X, Loader2 } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { getToken } = useAdminAuth();
  const [paints, setPaints] = useState<PaintProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPaint, setEditingPaint] = useState<PaintProduct | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Satin Finish',
    tagline: '',
    description: '',
    sizes: '20 Litres Drum\n4 Litres Gallon',
    coverage: 'Approx. 10 - 12 sq meters per litre',
    drying_time: 'Touch dry in 30 mins, recoat in 2-3 hours',
    finish_type: 'Smooth Classy Satin',
    features: 'Smooth Classy Satin Sheen\nHigh Coverage & Easy Washability\nFungus & Mould Resistant',
    image_url: '/images/zinux-bucket-hero.jpg',
    popular: true,
    display_order: 1,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPaints = async () => {
    try {
      const res = await fetch('/api/paints');
      const data = await res.json();
      setPaints(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaints();
  }, []);

  const openCreateModal = () => {
    setEditingPaint(null);
    setFormData({
      name: '',
      category: 'Satin Finish',
      tagline: '',
      description: '',
      sizes: '20 Litres Drum\n4 Litres Gallon',
      coverage: 'Approx. 10 - 12 sq meters per litre',
      drying_time: 'Touch dry in 30 mins',
      finish_type: 'Smooth Satin',
      features: 'High Coverage\nWashable',
      image_url: '/images/zinux-bucket-hero.jpg',
      popular: true,
      display_order: paints.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (p: PaintProduct) => {
    setEditingPaint(p);
    setFormData({
      name: p.name,
      category: p.category,
      tagline: p.tagline,
      description: p.description,
      sizes: (p.sizes || []).join('\n'),
      coverage: p.coverage,
      drying_time: p.drying_time,
      finish_type: p.finish_type,
      features: (p.features || []).join('\n'),
      image_url: p.image_url,
      popular: p.popular,
      display_order: p.display_order,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const token = getToken();
    const payload = {
      ...formData,
      sizes: formData.sizes.split('\n').map(s => s.trim()).filter(Boolean),
      features: formData.features.split('\n').map(s => s.trim()).filter(Boolean),
    };

    const method = editingPaint ? 'PUT' : 'POST';
    const body = editingPaint ? { id: editingPaint.id, ...payload } : payload;

    try {
      const res = await fetch('/api/paints', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save paint product');
      }

      setSuccess('Product saved successfully!');
      setModalOpen(false);
      broadcastContentUpdate('paints');
      fetchPaints();
    } catch (err: any) {
      setError(err.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this paint product?')) return;
    const token = getToken();
    try {
      const res = await fetch('/api/paints', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setPaints(prev => prev.filter(p => p.id !== id));
        broadcastContentUpdate('paints');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Paint Products Management</h2>
            <p className="text-xs text-slate-500 mt-1">Manage Zinux Paints catalogue (Classy Satin, Emulsion, Silk, Texcote, Gloss).</p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Paint Product</span>
          </button>
        </div>

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-xs text-slate-400">Loading products...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase">
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Finish</th>
                    <th className="p-4">Packaging Sizes</th>
                    <th className="p-4">Popular</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paints.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="p-4 font-bold text-slate-900">{p.name}</td>
                      <td className="p-4 text-slate-600 font-medium">{p.category}</td>
                      <td className="p-4 text-slate-500">{p.finish_type}</td>
                      <td className="p-4 text-slate-500">{(p.sizes || []).join(', ')}</td>
                      <td className="p-4">
                        {p.popular ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Featured</span>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditModal(p)} className="p-1.5 text-slate-600 hover:text-blue-600 rounded">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-600 hover:text-red-600 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Product Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">{editingPaint ? 'Edit Product' : 'Add Product'}</h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>

              {error && <div className="my-3 p-3 bg-red-50 text-red-700 text-xs rounded-lg">{error}</div>}

              <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category *</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Finish Type</label>
                    <input
                      type="text"
                      value={formData.finish_type}
                      onChange={(e) => setFormData({ ...formData, finish_type: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sizes (One per line)</label>
                    <textarea
                      rows={2}
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Features (One per line)</label>
                    <textarea
                      rows={2}
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <ImageUploader
                    label="Product Container / Formulation Image"
                    value={formData.image_url}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    folder="products"
                    aspectRatio="square"
                    helperText="Upload 20L drum, gallon, or paint finish photo"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600">Cancel</button>
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 flex items-center gap-1.5">
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Product</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
