import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Service } from '../../types';
import { broadcastContentUpdate } from '../../lib/cacheSync';
import { Plus, Edit2, Trash2, CheckCircle, X, Loader2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

export const AdminServices: React.FC = () => {
  const { getToken } = useAdminAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    short_desc: '',
    full_desc: '',
    features: '',
    icon: 'paint-roller',
    image_url: '',
    display_order: 1,
    is_published: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      slug: '',
      name: '',
      short_desc: '',
      full_desc: '',
      features: 'Interior Painting\nExterior Weatherproof\nSurface Preparation',
      icon: 'paint-roller',
      image_url: '/images/service-painting-detail.jpg',
      display_order: services.length + 1,
      is_published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      slug: service.slug,
      name: service.name,
      short_desc: service.short_desc,
      full_desc: service.full_desc,
      features: (service.features || []).join('\n'),
      icon: service.icon,
      image_url: service.image_url,
      display_order: service.display_order,
      is_published: service.is_published !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const token = getToken();
    const payload = {
      ...formData,
      features: formData.features.split('\n').map(s => s.trim()).filter(Boolean),
    };

    try {
      const url = '/api/services';
      const method = editingService ? 'PUT' : 'POST';
      const body = editingService ? { id: editingService.id, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save service');
      }

      setSuccess('Service saved successfully!');
      setModalOpen(false);
      broadcastContentUpdate('services');
      fetchServices();
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (service: Service) => {
    const token = getToken();
    const newStatus = !(service.is_published !== false);

    try {
      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: service.id, is_published: newStatus }),
      });

      if (res.ok) {
        setServices(prev => prev.map(s => s.id === service.id ? { ...s, is_published: newStatus } : s));
        setSuccess(`Service "${service.name}" ${newStatus ? 'published' : 'saved as draft'}.`);
        broadcastContentUpdate('services');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === services.length - 1)) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const current = services[index];
    const target = services[targetIndex];

    const newServices = [...services];
    newServices[index] = { ...target, display_order: current.display_order };
    newServices[targetIndex] = { ...current, display_order: target.display_order };
    setServices(newServices);

    const token = getToken();
    try {
      await Promise.all([
        fetch('/api/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id: current.id, display_order: target.display_order }),
        }),
        fetch('/api/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id: target.id, display_order: current.display_order }),
        }),
      ]);
      broadcastContentUpdate('services');
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    const token = getToken();
    try {
      const res = await fetch('/api/services', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setServices(prev => prev.filter(s => s.id !== id));
        broadcastContentUpdate('services');
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
            <h2 className="text-2xl font-bold text-slate-900">Services Management</h2>
            <p className="text-xs text-slate-500 mt-1">
              Create, edit, delete, reorder, and publish services for public display.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Services Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-xs text-slate-400">Loading services...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase">
                    <th className="p-4">Reorder</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Summary</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {services.map((srv, idx) => {
                    const isPub = srv.is_published !== false;
                    return (
                      <tr key={srv.id} className="hover:bg-slate-50/70">
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveOrder(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-100"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-bold text-slate-600 w-4 text-center">{srv.display_order}</span>
                            <button
                              type="button"
                              onClick={() => moveOrder(idx, 'down')}
                              disabled={idx === services.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-100"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-900">{srv.name}</td>
                        <td className="p-4 text-slate-500 font-mono">{srv.slug}</td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => togglePublish(srv)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                              isPub
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {isPub ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{isPub ? 'Published' : 'Draft'}</span>
                          </button>
                        </td>
                        <td className="p-4 text-slate-600 max-w-sm truncate">{srv.short_desc}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(srv)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(srv.id)}
                            className="p-1.5 text-slate-600 hover:text-red-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for create / edit */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="my-3 p-3 bg-red-50 text-red-700 text-xs rounded-lg">{error}</div>
              )}

              <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Service Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Slug *</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Short Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.short_desc}
                    onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Detailed Description</label>
                  <textarea
                    rows={3}
                    value={formData.full_desc}
                    onChange={(e) => setFormData({ ...formData, full_desc: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Features (One per line)</label>
                  <textarea
                    rows={3}
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <ImageUploader
                    label="Service Feature Image"
                    value={formData.image_url}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    folder="services"
                    aspectRatio="video"
                    helperText="Upload JPG, PNG, WEBP, or SVG for this service"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="srv_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded text-red-600"
                  />
                  <label htmlFor="srv_published" className="font-semibold text-slate-700">
                    Publish this service publicly
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 flex items-center gap-1.5"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Service</span>
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
