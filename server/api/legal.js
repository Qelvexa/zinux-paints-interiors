import supabase from '../db-client.js';
import { verifyAdmin } from '../auth-helper.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug } = req.query;
      if (slug) {
        const { data, error } = await supabase
          .from('legal_pages')
          .select('*')
          .eq('slug', slug)
          .single();
        if (error && error.code !== 'PGRST116') throw error;
        return res.status(200).json(data || null);
      }

      const { data, error } = await supabase
        .from('legal_pages')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const user = await verifyAdmin(req, res);
      if (!user) return;

      const { slug, title, content } = req.body;
      if (!slug || !title) {
        return res.status(400).json({ error: 'Slug and title are required.' });
      }

      const { data, error } = await supabase
        .from('legal_pages')
        .update({
          title,
          content,
          updated_at: new Date().toISOString()
        })
        .eq('slug', slug)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Legal API error:', err);
    res.status(500).json({ error: err.message });
  }
}
