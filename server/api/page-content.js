import supabase from '../db-client.js';
import { verifyAdmin } from '../auth-helper.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { page } = req.query;
      if (page) {
        const { data, error } = await supabase
          .from('page_content')
          .select('*')
          .eq('page_key', page)
          .single();
        if (error && error.code !== 'PGRST116') throw error;
        return res.status(200).json(data || { page_key: page, content: {} });
      }

      const { data, error } = await supabase
        .from('page_content')
        .select('*');
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const user = await verifyAdmin(req, res);
      if (!user) return;

      const { page_key, content } = req.body;
      if (!page_key || !content) {
        return res.status(400).json({ error: 'page_key and content object are required.' });
      }

      const { data, error } = await supabase
        .from('page_content')
        .upsert({
          page_key,
          content,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Page Content API error:', err);
    res.status(500).json({ error: err.message });
  }
}
