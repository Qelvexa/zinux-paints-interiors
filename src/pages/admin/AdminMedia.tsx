import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Upload, Copy, Check, Loader2, Trash2 } from 'lucide-react';

export const AdminMedia: React.FC = () => {
  const { getToken } = useAdminAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  const fetchFiles = async () => {
    try {
      const token = getToken();
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/upload', {
        headers,
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const token = getToken();
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            fileBase64: base64,
            contentType: file.type,
            folder: 'uploads',
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Upload failed');
        }

        const data = await res.json();
        setUploadSuccess(`File uploaded successfully to Supabase: ${data.url}`);
        fetchFiles();
      } catch (err: any) {
        setUploadError(err.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 3000);
  };

  const handleDeleteFile = async (fileName: string) => {
    if (!window.confirm(`Delete "${fileName}" from storage?`)) return;

    try {
      const token = getToken();
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileName }),
      });

      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.name !== fileName));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Media Library &amp; Supabase Storage</h2>
          <p className="text-xs text-slate-500 mt-1">Upload high-resolution images for projects, paint buckets, and brand assets.</p>
        </div>

        {/* Upload Box */}
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center shadow-sm">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Upload Media File</h3>
            <p className="text-xs text-slate-500">Supports PNG, JPG, WEBP, SVG up to 10MB</p>

            <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow transition">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading to Supabase...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Select Image to Upload</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
            </label>
          </div>
        </div>

        {uploadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
            {uploadSuccess}
          </div>
        )}

        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-xl">
            {uploadError}
          </div>
        )}

        {/* Files Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Uploaded Media Files</h3>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading files...</div>
          ) : files.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No files in Supabase storage yet. Upload your first image above.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {files.map((file, i) => (
                <div key={i} className="group border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col justify-between">
                  <div className="image-container aspect-square bg-slate-950 overflow-hidden relative w-full">
                    <img src={file.publicUrl} alt={file.name} className="absolute inset-0 w-full h-full object-cover object-center block group-hover:scale-105 transition duration-300" />
                  </div>
                  <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between gap-1">
                    <span className="text-[10px] text-slate-700 truncate font-medium flex-1">{file.name}</span>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        onClick={() => copyToClipboard(file.publicUrl)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600 transition"
                        title="Copy URL"
                      >
                        {copiedUrl === file.publicUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file.name)}
                        className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition"
                        title="Delete from storage"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};
