import supabase from '../db-client.js';
import { verifyAdmin, AUTHORIZED_ADMIN_EMAIL } from '../auth-helper.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'POST') {
    const user = await verifyAdmin(req, res);
    if (!user) return; // verifyAdmin handled response

    return res.status(200).json({
      authorized: true,
      email: user.email,
      id: user.id
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
