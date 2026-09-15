import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import supabase from '../../lib/supabase';

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  helperText?: string;
  aspectRatio?: 'video' | 'square' | 'auto';
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  folder = 'general',
  helperText = 'Supports JPG, PNG, WEBP, SVG up to 10MB',
  aspectRatio = 'auto',
  className = '',
}) => {
  const { getToken } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState(false);

  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccessNotice(false);

    // Validate type
    if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
      setError(`Unsupported file type: ${file.type || 'unknown'}. Please choose a JPG, PNG, WEBP, or SVG image.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is 10MB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          let token = getToken();
          if (!token) {
            const { data: sessionData } = await supabase.auth.getSession();
            token = sessionData?.session?.access_token || null;
          }

          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              fileName: file.name,
              fileBase64: base64Data,
              contentType: file.type,
              folder,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || 'Failed to upload to Supabase Storage');
          }

          // If previous image was in Supabase storage, safely clean it up in background
          if (value && value.includes('/storage/v1/object/public/media/')) {
            fetch('/api/upload', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ fileUrl: value }),
            }).catch(() => {});
          }

          onChange(data.url);
          setSuccessNotice(true);
          setTimeout(() => setSuccessNotice(false), 3000);
        } catch (err: any) {
          setError(err.message || 'Upload failed');
        } finally {
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };

      reader.onerror = () => {
        setError('Failed to read file from disk');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Upload initialization error');
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    const prevUrl = value;
    onChange('');

    // If it was in Supabase storage, clean up file
    if (prevUrl && prevUrl.includes('/storage/v1/object/public/media/')) {
      try {
        let token = getToken();
        if (!token) {
          const { data: sessionData } = await supabase.auth.getSession();
          token = sessionData?.session?.access_token || null;
        }
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fileUrl: prevUrl }),
        });
      } catch {
        // Silently ignore cleanup error on remove
        void 0;
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            {label}
          </label>
          {successNotice && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-3 h-3" /> Uploaded to Supabase!
            </span>
          )}
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Error alert */}
      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-red-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Preview Card or Upload Dropzone */}
      {value ? (
        <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
          <div className={`image-container relative rounded-xl overflow-hidden bg-slate-950 border border-slate-200 w-full ${
            aspectRatio === 'video' ? 'aspect-video' : aspectRatio === 'square' ? 'aspect-square max-w-[200px] mx-auto' : 'aspect-video sm:aspect-[16/9] max-h-56'
          }`}>
            <img
              src={value}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover object-center block"
            />
            {uploading && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                <span className="text-xs font-semibold">Uploading new image...</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] text-slate-400 font-mono truncate" title={value}>
                {value}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition disabled:opacity-50"
                title="Replace image"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace</span>
              </button>

              <button
                type="button"
                disabled={uploading}
                onClick={handleRemove}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition"
                title="Remove image"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Control */
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-red-500 bg-slate-50 hover:bg-red-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 group-hover:text-red-600 group-hover:border-red-200 flex items-center justify-center shadow-xs transition">
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-red-600" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition">
                {uploading ? 'Uploading to Supabase Storage...' : 'Click to Upload Image'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{helperText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
