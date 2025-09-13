# Déploiement sur Vercel (sans Gemini)

Ce projet a été nettoyé pour supprimer/neutraliser **toute intégration Gemini** afin d'éviter les erreurs d'API
et faciliter le déploiement sur **Vercel**.

## Ce que j'ai fait
- Retrait des dépendances Gemini dans `package.json` (ex: `@google/generative-ai`).
- Neutralisation des imports et appels Gemini dans le code (voir `src/lib/gemini-disabled.ts`).
- Ajout d'un `vercel.json` pour un build statique (Vite) et du routing SPA.
- Ajout d'un `.vercelignore` pour ignorer les artefacts locaux.
- Vérification/ajout du script `build` dans `package.json`.

## Pré-requis
- Node.js 18+
- Vercel CLI (optionnel) : `npm i -g vercel`

## Commandes locales
```bash
npm install
npm run build
npm run preview
```

## Déploiement via GitHub
1. **Crée un nouveau repo GitHub** et pousse le dossier.
2. Sur **vercel.com**, crée un **New Project** → **Import Git Repository**.
3. Framework preset : *Other* (ou Vite, si détecté automatiquement).
4. **Build Command** : `npm run build`
5. **Output Directory** : `dist`
6. **Install Command** : laisser vide (Vercel détecte) ou `npm install`.
7. Déploie. Vercel va builder puis servir `dist/`.

## Déploiement via Vercel CLI
```bash
vercel
vercel --prod
```

## Notes
- Tous les appels GEMINI sont **désactivés**. Les écrans continueront à fonctionner mais sans génération de texte.
- Si tu dois réactiver l'IA plus tard, remplace les imports par un vrai client et configure les variables d'env côté Vercel.

Bonne mise en ligne !
