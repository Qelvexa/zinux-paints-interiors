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
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const user = await verifyAdmin(req, res);
      if (!user) return;

      const { slug, name, short_desc, full_desc, features, icon, image_url, display_order, is_published } = req.body;
      if (!name || !slug) return res.status(400).json({ error: 'Name and slug are required.' });

      const insertPayload = {
        slug,
        name,
        short_desc: short_desc || '',
        full_desc: full_desc || '',
        features: Array.isArray(features) ? features : [],
        icon: icon || 'paint-roller',
        image_url: image_url || '/images/service-painting-detail.jpg',
        display_order: Number(display_order) || 1,
      };

      if (is_published !== undefined) insertPayload.is_published = Boolean(is_published);

      const { data, error } = await supabase
        .from('services')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const user = await verifyAdmin(req, res);
      if (!user) return;

      const { id, slug, name, short_desc, full_desc, features, icon, image_url, display_order, is_published } = req.body;
      if (!id) return res.status(400).json({ error: 'Service ID is required.' });

      const updatePayload = {};
      if (slug !== undefined) updatePayload.slug = slug;
      if (name !== undefined) updatePayload.name = name;
      if (short_desc !== undefined) updatePayload.short_desc = short_desc;
      if (full_desc !== undefined) updatePayload.full_desc = full_desc;
      if (features !== undefined) updatePayload.features = Array.isArray(features) ? features : [];
      if (icon !== undefined) updatePayload.icon = icon;
      if (image_url !== undefined) updatePayload.image_url = image_url;
      if (display_order !== undefined) updatePayload.display_order = Number(display_order);
      if (is_published !== undefined) updatePayload.is_published = Boolean(is_published);

      const { data, error } = await supabase
        .from('services')
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
      if (!id) return res.status(400).json({ error: 'Service ID is required.' });

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error in services:', err);
    res.status(500).json({ error: err.message });
  }
}
