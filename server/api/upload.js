import supabase from '../db-client.js';
import { verifyAdmin } from '../auth-helper.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '12mb',
    },
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const user = await verifyAdmin(req, res);
    if (!user) return;

    if (req.method === 'GET') {
      const { data, error } = await supabase.storage
        .from('media')
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

      if (error) throw error;

      const filesWithUrls = (data || []).map((file) => {
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(file.name);
        return {
          ...file,
          publicUrl: urlData.publicUrl,
        };
      });

      return res.status(200).json(filesWithUrls);
    }

    if (req.method === 'POST') {
      const { fileName, fileBase64, contentType, folder } = req.body || {};
      if (!fileName || !fileBase64) {
        return res.status(400).json({ error: 'fileName and fileBase64 are required.' });
      }

      // Validate allowed mime types
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
      const mime = (contentType || 'image/jpeg').toLowerCase();
      if (!allowedTypes.includes(mime)) {
        return res.status(400).json({
          error: `Invalid file format: ${mime}. Allowed formats: JPG, PNG, WEBP, SVG.`,
        });
      }

      const buffer = Buffer.from(fileBase64, 'base64');
      if (buffer.length > 10 * 1024 * 1024) {
        return res.status(400).json({ error: 'File size exceeds 10MB limit.' });
      }

      const fileExt = fileName.split('.').pop()?.toLowerCase() || 'jpg';
      const rawBase = fileName.substring(0, fileName.lastIndexOf('.')) || 'image';
      const cleanBase = rawBase.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const cleanFileName = `${cleanBase}-${uniqueSuffix}.${fileExt}`;
      const storagePath = folder ? `${folder}/${cleanFileName}` : cleanFileName;

      const { data, error } = await supabase.storage
        .from('media')
        .upload(storagePath, buffer, {
          contentType: mime,
          upsert: true,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(storagePath);

      const publicUrl = urlData.publicUrl ? `${urlData.publicUrl}?v=${Date.now()}` : '';

      return res.status(200).json({
        success: true,
        fileName: cleanFileName,
        path: data.path,
        url: publicUrl,
      });
    }

    if (req.method === 'DELETE') {
      const { fileName, fileUrl } = req.body || {};
      let pathToDelete = fileName;
      if (!pathToDelete && fileUrl && typeof fileUrl === 'string') {
        const parts = fileUrl.split('/media/');
        if (parts.length > 1) {
          pathToDelete = decodeURIComponent(parts[1].split('?')[0]);
        }
      }

      if (pathToDelete) {
        await supabase.storage.from('media').remove([pathToDelete]);
      }

      return res.status(200).json({ success: true, removed: pathToDelete || null });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Storage upload API error:', err);
    res.status(500).json({ error: err.message || 'Storage error' });
  }
}
