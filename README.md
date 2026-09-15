# Zinux Paints & Interior

Production-ready React + TypeScript + Vite website with Supabase-backed content management and a protected administrator area.

## Deployment

1. Install dependencies:
   `npm install`
2. Run a production build:
   `npm run build`
3. In Vercel, add the variables from `.env.example`.
4. Add the Supabase URL and anon key as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Add the server-only Supabase service-role key as `SUPABASE_SERVICE_ROLE_KEY`.
6. Set `SUPABASE_URL` to the same Supabase project URL.
7. Set `ADMIN_EMAIL` to the single administrator account.
8. In Supabase Auth URL Configuration, allow the deployed site origin and `/admin/setup` recovery redirect.

## Security

- Never commit `.env`, `.env.local`, Vercel secrets, or the Supabase service-role key.
- If a service-role key was previously committed or shared, rotate it in Supabase before deployment.
- The service-role key is server-only and must never use a `VITE_` prefix.
- Administrator password creation requires a valid Supabase recovery session.
