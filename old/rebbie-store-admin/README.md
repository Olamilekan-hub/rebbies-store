# Rebbie's Store - Admin Dashboard

This is the admin interface for Rebbie's Store, deployed separately from the backend API.

## Deployment

This admin interface is automatically deployed to Netlify and connects to the backend API at:
`https://rebbies-store-y5cp.onrender.com`

## Local Development

To update the admin interface:
1. Make changes in the main backend repository
2. Run `npm run build:admin` in the backend
3. Copy the updated files from `.medusa/admin/` to this repository
4. Commit and push changes to trigger Netlify deployment

## Configuration

- **Backend URL**: Configured via `window.__MEDUSA_BACKEND_URL__` in index.html
- **Netlify Config**: See `netlify.toml` for deployment settings