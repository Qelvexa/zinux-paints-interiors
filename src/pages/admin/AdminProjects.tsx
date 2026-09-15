import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { GalleryUploader } from '../../components/admin/GalleryUploader';
import { Project } from '../../types';
import { broadcastContentUpdate } from '../../lib/cacheSync';
import { Plus, Edit2, Trash2, CheckCircle, X, Loader2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const { getToken } = useAdminAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Painting',
    category_slug: 'painting',
    description: '',
    image_url: '/images/project-exterior.jpg',
    gallery_images: [] as string[],
    client_type: 'Residential',
    completion_time: 'Completed to specifications',
    featured: true,
    display_order: 1,
    is_published: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'Painting',
      category_slug: 'painting',
      description: '',
      image_url: '/images/project-exterior.jpg',
      gallery_images: ['/images/project-exterior.jpg'],
      client_type: 'Residential',
      completion_time: 'Completed to specifications',
      featured: true,
      display_order: projects.length + 1,
      is_published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      category: p.category,
      category_slug: p.category_slug,
      description: p.description,
      image_url: p.image_url,
      gallery_images: Array.isArray(p.gallery_images) && p.gallery_images.length > 0 ? p.gallery_images : [p.image_url],
      client_type: p.client_type,
      completion_time: p.completion_time,
      featured: p.featured,
      display_order: p.display_order,
      is_published: p.is_published !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const token = getToken();
    const method = editingProject ? 'PUT' : 'POST';
    const body = editingProject ? { id: editingProject.id, ...formData } : formData;

    try {
      const res = await fetch('/api/projects', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save project');
      }

      setSuccess('Project saved successfully!');
      setModalOpen(false);
      broadcastContentUpdate('projects');
      fetchProjects();
    } catch (err: any) {
      setError(err.message || 'Error saving project');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (project: Project) => {
    const token = getToken();
    const newStatus = !(project.is_published !== false);

    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: project.id, is_published: newStatus }),
      });

      if (res.ok) {
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, is_published: newStatus } : p));
        setSuccess(`Project "${project.title}" ${newStatus ? 'published' : 'saved as draft'}.`);
        broadcastContentUpdate('projects');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === projects.length - 1)) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const current = projects[index];
    const target = projects[targetIndex];

    const newProjects = [...projects];
    newProjects[index] = { ...target, display_order: current.display_order };
    newProjects[targetIndex] = { ...current, display_order: target.display_order };
    setProjects(newProjects);

    const token = getToken();
    try {
      await Promise.all([
        fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id: current.id, display_order: target.display_order }),
        }),
        fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id: target.id, display_order: current.display_order }),
        }),
      ]);
      broadcastContentUpdate('projects');
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const token = getToken();
    try {
      const res = await fetch('/api/projects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
        broadcastContentUpdate('projects');
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
            <h2 className="text-2xl font-bold text-slate-900">Project Portfolio Management</h2>
            <p className="text-xs text-slate-500 mt-1">
              Add, edit, delete, reorder, publish, and manage multi-photo galleries for projects.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
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
            <div className="p-10 text-center text-xs text-slate-400">Loading projects...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase">
                    <th className="p-4">Reorder</th>
                    <th className="p-4">Image</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Gallery</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((p, idx) => {
                    const isPub = p.is_published !== false;
                    const galleryCount = (p.gallery_images || []).length;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70">
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
                            <span className="font-bold text-slate-600 w-4 text-center">{p.display_order}</span>
                            <button
                              type="button"
                              onClick={() => moveOrder(idx, 'down')}
                              disabled={idx === projects.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-100"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="image-container w-12 h-9 rounded overflow-hidden relative shrink-0 bg-slate-900 border border-slate-700">
                            <img src={p.image_url} alt="" className="w-full h-full object-cover object-center block" />
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-900">{p.title}</td>
                        <td className="p-4 font-medium text-slate-600">{p.category}</td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => togglePublish(p)}
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
                        <td className="p-4 text-slate-500">{p.client_type}</td>
                        <td className="p-4 text-slate-500">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold">
                            {galleryCount} photos
                          </span>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">{editingProject ? 'Edit Project' : 'Add Project'}</h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>

              {error && <div className="my-3 p-3 bg-red-50 text-red-700 text-xs rounded-lg">{error}</div>}

              <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value, category_slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Painting">Painting</option>
                      <option value="POP & Interior">POP &amp; Interior</option>
                      <option value="Solar">Solar</option>
                      <option value="Zinux Paints">Zinux Paints</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Client Type</label>
                    <input
                      type="text"
                      value={formData.client_type}
                      onChange={(e) => setFormData({ ...formData, client_type: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <ImageUploader
                    label="Primary Cover Image *"
                    value={formData.image_url}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    folder="projects/cover"
                    aspectRatio="video"
                    helperText="Upload primary showcase cover image"
                  />
                </div>

                {/* Gallery Management Section */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <GalleryUploader
                    images={formData.gallery_images}
                    onChange={(imgs) => setFormData({ ...formData, gallery_images: imgs })}
                    folder="projects/gallery"
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
                    <label className="block font-bold text-slate-700 mb-1">Completion Note</label>
                    <input
                      type="text"
                      value={formData.completion_time}
                      onChange={(e) => setFormData({ ...formData, completion_time: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
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
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded text-red-600"
                    />
                    <label htmlFor="featured" className="text-xs font-semibold text-slate-700">Featured</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="proj_published"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="rounded text-red-600"
                    />
                    <label htmlFor="proj_published" className="text-xs font-semibold text-slate-700">Publish Publicly</label>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600">Cancel</button>
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 flex items-center gap-1.5">
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Project</span>
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
