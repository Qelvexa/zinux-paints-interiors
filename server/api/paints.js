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
        .from('paints')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const user = await verifyAdmin(req, res);
      if (!user) return;

      const { name, category, tagline, description, sizes, coverage, drying_time, finish_type, features, image_url, popular, display_order } = req.body;
      if (!name || !category) return res.status(400).json({ error: 'Name and category are required.' });

      const { data, error } = await supabase
        .from('paints')
        .insert({
          name,
          category,
          tagline: tagline || '',
          description: description || '',
          sizes: Array.isArray(sizes) ? sizes : ['20 Litres Drum', '4 Litres Gallon'],
          coverage: coverage || '',
          drying_time: drying_time || '',
          finish_type: finish_type || '',
          features: Array.isArray(features) ? features : [],
          image_url: image_url || '/images/zinux-bucket-hero.jpg',
          popular: Boolean(popular),
          display_order: Number(display_order) || 1
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const user = await verifyAdmin(req, res);
      if (!user) return;

      const { id, name, category, tagline, description, sizes, coverage, drying_time, finish_type, features, image_url, popular, display_order } = req.body;
      if (!id) return res.status(400).json({ error: 'Paint product ID is required.' });

      const { data, error } = await supabase
        .from('paints')
        .update({
          name,
          category,
          tagline,
          description,
          sizes: Array.isArray(sizes) ? sizes : ['20 Litres Drum', '4 Litres Gallon'],
          coverage,
          drying_time,
          finish_type,
          features: Array.isArray(features) ? features : [],
          image_url,
          popular: Boolean(popular),
          display_order: Number(display_order) || 1
        })
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
      if (!id) return res.status(400).json({ error: 'Paint product ID is required.' });

      const { error } = await supabase
        .from('paints')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error in paints:', err);
    res.status(500).json({ error: err.message });
  }
}
