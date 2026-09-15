import supabase from './db-client.js';

export const AUTHORIZED_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();

export async function verifyAdmin(req, res) {
  if (!AUTHORIZED_ADMIN_EMAIL) {
    res.status(500).json({ error: 'Administrator account is not configured.' });
    return null;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or malformed authorization token.' });
    return null;
  }

  const token = authHeader.slice('Bearer '.length).trim();
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired session token.' });
    return null;
  }

  if (user.email?.trim().toLowerCase() !== AUTHORIZED_ADMIN_EMAIL) {
    res.status(403).json({ error: 'Forbidden: Administrator access is not authorized for this account.' });
    return null;
  }

  return user;
}
