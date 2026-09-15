import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, ArrowLeft, ArrowRight, ImagePlus, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import supabase from '../../lib/supabase';

interface GalleryUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
  className?: string;
}

export const GalleryUploader: React.FC<GalleryUploaderProps> = ({
  images,
  onChange,
  folder = 'projects/gallery',
  className = '',
}) => {
  const { getToken } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];

  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setError(null);
    setUploading(true);
    setProgressText(`Preparing ${fileList.length} image(s)...`);

    const files = Array.from(fileList);
    let token = getToken();
    if (!token) {
      const { data: sessionData } = await supabase.auth.getSession();
      token = sessionData?.session?.access_token || null;
    }
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
        setError(`Skipped "${file.name}": Unsupported format. Allowed: JPG, PNG, WEBP, SVG.`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError(`Skipped "${file.name}": Exceeds 10MB limit.`);
        continue;
      }

      setProgressText(`Uploading ${i + 1} of ${files.length}: ${file.name}...`);

      try {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

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

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            uploadedUrls.push(data.url);
          }
        }
      } catch (err: any) {
        console.error('Gallery file upload error:', err);
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
    }

    setUploading(false);
    setProgressText(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (idx: number) => {
    const targetUrl = images[idx];
    const newImages = images.filter((_, i) => i !== idx);
    onChange(newImages);

    // Clean up from storage if it is in Supabase media
    if (targetUrl && targetUrl.includes('/storage/v1/object/public/media/')) {
      (async () => {
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
            body: JSON.stringify({ fileUrl: targetUrl }),
          });
        } catch {
          // Silently ignore cleanup error
          void 0;
        }
      })();
    }
  };

  const moveImage = (idx: number, direction: 'left' | 'right') => {
    if ((direction === 'left' && idx === 0) || (direction === 'right' && idx === images.length - 1)) return;
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    const copy = [...images];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    onChange(copy);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Project Gallery Images ({images.length})
          </label>
          <p className="text-[10px] text-slate-400">
            Upload multiple photos, reorder them, or remove anytime.
          </p>
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <ImagePlus className="w-3.5 h-3.5" />
              <span>Upload Images</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        onChange={handleFilesSelect}
        className="hidden"
        disabled={uploading}
      />

      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-red-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {progressText && (
        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-xs flex items-center gap-2 font-medium">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{progressText}</span>
        </div>
      )}

      {images.length === 0 ? (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-red-500 bg-slate-50 hover:bg-red-50/20 rounded-2xl p-6 text-center cursor-pointer transition"
        >
          <div className="flex flex-col items-center justify-center gap-1.5">
            <Upload className="w-5 h-5 text-slate-400" />
            <p className="text-xs font-bold text-slate-700">No gallery images uploaded yet</p>
            <p className="text-[10px] text-slate-400">Click to select and upload multiple local photos</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((imgUrl, i) => (
            <div
              key={i}
              className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs"
            >
              <div className="image-container aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center relative">
                <img src={imgUrl} alt={`Gallery ${i}`} className="absolute inset-0 w-full h-full object-cover object-center block" />
              </div>

              {/* Action bar overlay */}
              <div className="p-1.5 bg-white/95 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 font-bold px-1">#{i + 1}</span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(i, 'left')}
                    disabled={i === 0}
                    className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-20 rounded hover:bg-slate-100"
                    title="Move left"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveImage(i, 'right')}
                    disabled={i === images.length - 1}
                    className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-20 rounded hover:bg-slate-100"
                    title="Move right"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50"
                    title="Remove photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
