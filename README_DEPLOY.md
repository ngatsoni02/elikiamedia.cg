# Déploiement sur Vercel (Vite + React)

## Prérequis (Windows)
1) Installer Node.js LTS (≥ 18) : https://nodejs.org/
2) Ouvrir **Windows PowerShell** en administrateur et exécuter **une seule fois** :
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
> Si vous ne voulez pas changer la stratégie de façon permanente, utilisez au lieu de ça dans chaque session :
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## Test en local
```powershell
npm ci || npm install
npm run build
npm run preview
```
Visitez http://localhost:4173

## Déploiement via GitHub (recommandé)
1. Créez un dépôt Git et poussez ce dossier :
```powershell
git init
git add .
git commit -m "Initial"
git branch -M main
git remote add origin https://github.com/VOTRE_NOM/elikia-media-app.git
git push -u origin main
```
2. Allez sur **Vercel → New Project → Import Git Repository**.
3. Framework : **Vite**, Build Command : `npm run build`, Output : `dist` (auto-détecté).
4. Variables d’environnement : ajoutez au besoin `GEMINI_API_KEY`.
5. Deploy.

## Déploiement via Vercel CLI (alternatif)
```powershell
npm i -g vercel
vercel login
vercel
# puis pour la prod :
vercel --prod
```

## Routage SPA (React)
Le fichier `vercel.json` inclut un rewrite vers `index.html` pour que le routage côté client fonctionne sur Vercel.
