# Déploiement sur Vercel — Guide rapide

Ce projet a été préparé pour un déploiement **Vercel** en mode **Vite + SPA**.

## Prérequis
- Compte GitHub et Vercel
- Node.js LTS (18+)

## Scripts (package.json)
- `npm run dev` — lancement local
- `npm run build` — build de production (sortie dans `dist/`)
- `npm run preview` — prévisualiser le build

## Fichiers ajoutés/ajustés
- `vercel.json` : réécrit toutes les routes vers `index.html` (routing côté client)
- `package.json > vercel` : `buildCommand: npm run build`, `outputDirectory: dist`
- `404.html` : fallback statique (copie de `index.html`) pour certaines configs CDN

## Déploiement (deux options)

### A) Via GitHub (recommandé)
1. Créez un repo GitHub et poussez le code.
2. Sur https://vercel.com — **Add New Project** → Importez le repo.
3. Réglages :
   - Framework: **Other** (ou Vite, si détecté automatiquement).
   - **Build Command**: `npm run build` (déjà défini).
   - **Output Directory**: `dist`.
4. **Deploy**.

### B) Upload direct (si pas de GitHub)
1. Zipez le dossier du projet.
2. Dans Vercel → **Add New Project** → **Import** → **Upload** le zip.
3. Conservez `Build Command` = `npm run build` et `Output Directory` = `dist`.

## Astuces
- Si vous utilisez **React Router**, laissez `vercel.json` tel quel pour éviter les 404.
- Si vous avez des variables d'environnement (API, clés), déclarez-les dans **Vercel → Settings → Environment Variables**, puis redéployez.

Bon déploiement !
