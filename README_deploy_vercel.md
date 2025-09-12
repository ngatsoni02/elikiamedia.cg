# Déploiement sur Vercel (ELIKIA MEDIA)

## Build settings (Vercel → Project → Settings → Build & Output)
- Framework Preset: **Vite**
- Install Command: `npm ci` (ou `npm install`)
- Build Command: **`npm run build`**
- Output Directory: **`dist`**
- Node version: **18+**

## Variables d'environnement (Settings → Environment Variables)
- `VITE_GEMINI_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Routage SPA
`vercel.json` inclus :
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
