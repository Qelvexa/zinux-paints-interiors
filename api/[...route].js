import adminSetup from '../server/api/admin-setup.js';
import appearance from '../server/api/appearance.js';
import authVerify from '../server/api/auth-verify.js';
import contact from '../server/api/contact.js';
import legal from '../server/api/legal.js';
import pageContent from '../server/api/page-content.js';
import paints from '../server/api/paints.js';
import projects from '../server/api/projects.js';
import quotes from '../server/api/quotes.js';
import seo from '../server/api/seo.js';
import services from '../server/api/services.js';
import settings from '../server/api/settings.js';
import upload from '../server/api/upload.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '12mb',
    },
  },
};

const handlers = {
  'admin-setup': adminSetup,
  appearance,
  'auth-verify': authVerify,
  contact,
  legal,
  'page-content': pageContent,
  paints,
  projects,
  quotes,
  seo,
  services,
  settings,
  upload,
};

export default async function handler(req, res) {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const parts = url.pathname.split('/').filter(Boolean);
  const route = parts[0] === 'api' ? parts.slice(1).join('/') : parts.join('/');
  const target = handlers[route];

  if (!target) {
    return res.status(404).json({ error: 'API route not found' });
  }

  return target(req, res);
}
