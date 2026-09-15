import supabase from '../db-client.js';
import { verifyAdmin } from '../auth-helper.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      let query = supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      const { category } = req.query;
      if (category && category !== 'All' && category !== 'all') {
        query = query.ilike('category', `%${category}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const user = await verifyAdmin(req, res);
      if (!user) return;

      const { title, category, category_slug, description, image_url, gallery_images, client_type, completion_time, featured, display_order, is_published } = req.body;
      if (!title || !category || !image_url) {
        return res.status(400).json({ error: 'Title, category, and image URL are required.' });
      }

      const insertPayload = {
        title,
        category,
        category_slug: category_slug || category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description: description || '',
        image_url,
        gallery_images: Array.isArray(gallery_images) ? gallery_images : [image_url],
        client_type: client_type || 'Residential',
        completion_time: completion_time || 'Completed to specifications',
        featured: Boolean(featured),
        display_order: Number(display_order) || 1,
      };

      if (is_published !== undefined) insertPayload.is_published = Boolean(is_published);

      const { data, error } = await supabase
        .from('projects')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const user = await verifyAdmin(req, res);
      if (!user) return;

      const { id, title, category, category_slug, description, image_url, gallery_images, client_type, completion_time, featured, display_order, is_published } = req.body;
      if (!id) return res.status(400).json({ error: 'Project ID is required.' });

      const updatePayload = {};
      if (title !== undefined) updatePayload.title = title;
      if (category !== undefined) updatePayload.category = category;
      if (category_slug !== undefined) updatePayload.category_slug = category_slug;
      if (description !== undefined) updatePayload.description = description;
      if (image_url !== undefined) updatePayload.image_url = image_url;
      if (gallery_images !== undefined) updatePayload.gallery_images = Array.isArray(gallery_images) ? gallery_images : [];
      if (client_type !== undefined) updatePayload.client_type = client_type;
      if (completion_time !== undefined) updatePayload.completion_time = completion_time;
      if (featured !== undefined) updatePayload.featured = Boolean(featured);
      if (display_order !== undefined) updatePayload.display_order = Number(display_order);
      if (is_published !== undefined) updatePayload.is_published = Boolean(is_published);

      const { data, error } = await supabase
        .from('projects')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const user = await verifyAdmin(req, res);
      if (!user) return;

      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'Project ID is required.' });

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error in projects:', err);
    res.status(500).json({ error: err.message });
  }
}
