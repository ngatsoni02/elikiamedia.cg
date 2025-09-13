# Déploiement sur Vercel — Elikia Media (v6)

Ce dépôt a été préparé pour un déploiement **Vercel** :
- Scripts `npm run build` / `npm run preview` (Vite si présent).
- **`vercel.json`** : assets servis tels quels + fallback SPA (`/(.*) -> /index.html`).
- **`public/index.css`** : évite les 404 si référencé par `/index.css`.
- **Gemini**: dépendances et imports neutralisés si trouvés.

## Local
```bash
npm install
npm run build
npm run preview
```

## Vercel
- **Build Command** : `npm run build`
- **Output Directory** : `dist`
- Framework Preset : **Other** (ou **Vite** si détecté)

> Si tu utilises React Router en mode **HashRouter**, les liens `/#/article/...` fonctionneront sans réécritures supplémentaires.
> Si tu utilises **BrowserRouter**, le fallback SPA gère les liens profonds `/article/...`.

Bonne mise en ligne !
