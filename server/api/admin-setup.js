import supabase from '../db-client.js';
import { AUTHORIZED_ADMIN_EMAIL } from '../auth-helper.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!AUTHORIZED_ADMIN_EMAIL) {
    return res.status(500).json({ error: 'Administrator account is not configured.' });
  }

  try {
    const { email } = req.body || {};

    if (!email || email.trim().toLowerCase() !== AUTHORIZED_ADMIN_EMAIL) {
      return res.status(403).json({
        error: 'Setup is only available for the configured administrator account.',
      });
    }

    const forwardedProto = req.headers['x-forwarded-proto'];
    const protocol = typeof forwardedProto === 'string' ? forwardedProto.split(',')[0].trim() : 'https';
    const host = req.headers.host;

    if (!host) {
      return res.status(400).json({ error: 'Unable to determine the site origin.' });
    }

    const redirectTo = `${protocol}://${host}/admin/setup`;

    const { error } = await supabase.auth.resetPasswordForEmail(
      AUTHORIZED_ADMIN_EMAIL,
      { redirectTo }
    );

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'A secure password setup email has been sent. Check the administrator inbox.',
    });
  } catch (err) {
    console.error('Admin setup error:', err);
    return res.status(500).json({ error: 'Failed to send the administrator setup email.' });
  }
}
