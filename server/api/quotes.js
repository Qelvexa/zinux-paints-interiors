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
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const {
        full_name,
        phone,
        email,
        service,
        project_type,
        size_estimate,
        paint_preference,
        description
      } = req.body || {};

      if (!full_name || !phone) {
        return res.status(400).json({ error: 'Full name and phone number are required.' });
      }

      const { data, error } = await supabase
        .from('quotes')
        .insert({
          full_name,
          phone,
          email: email || null,
          service: service || 'General Inquiry',
          project_type: project_type || 'Residential',
          size_estimate: size_estimate || 'Standard',
          paint_preference: paint_preference || null,
          description: description || null,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const user = await verifyAdmin(req, res);
      if (!user) return;

      const { id, status } = req.body;
      if (!id) return res.status(400).json({ error: 'Quote ID is required.' });

      const { data, error } = await supabase
        .from('quotes')
        .update({ status })
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
      if (!id) return res.status(400).json({ error: 'Quote ID is required.' });

      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error in quotes:', err);
    res.status(500).json({ error: err.message });
  }
}
