# rayansu

## Deployment (Vercel)

For admin features (dashboard access and "لوحة الإدارة" in the profile/hamburger menu) to work in production:

1. In Vercel → Project → **Settings** → **Environment Variables**, add:
   - **`ADMIN_EMAILS`** = comma-separated admin emails, e.g. `admin@gmail.com` (same as in your `.env` locally).
2. Redeploy after adding or changing variables.

Without `ADMIN_EMAILS` on Vercel, the admin check returns false: dashboard login redirects to `/events` and the profile menu does not show "لوحة الإدارة".
