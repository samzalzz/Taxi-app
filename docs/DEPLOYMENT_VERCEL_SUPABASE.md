# Déploiement Production: Vercel + Supabase

Ce guide couvre le déploiement de Taxi Leblanc en production sur Vercel (hébergement) avec Supabase (PostgreSQL managé).

## ✅ Pré-requis

- [x] Code committed sur GitHub (https://github.com/samzalzz/Taxi-app)
- [x] Tous les fixes code appliqués (`package.json`, `prisma/schema.prisma`, `vercel.json`, etc.)
- [x] Compte Supabase gratuit ou payant
- [x] Compte Vercel (peut utiliser GitHub pour login)
- [x] Accès à un domaine personnalisé (optionnel, Vercel offre des sous-domaines gratuits)

---

## 📋 Checklist de Déploiement

- [ ] **Étape 1**: Créer un projet Supabase
- [ ] **Étape 2**: Obtenir les URLs de connexion (Pooler + Direct)
- [ ] **Étape 3**: Lancer la migration de base de données
- [ ] **Étape 4**: Pousser le code sur GitHub
- [ ] **Étape 5**: Créer un projet Vercel et configurer les env vars
- [ ] **Étape 6**: Première publication et création de l'admin
- [ ] **Étape 7**: Tests et vérifications

---

## 🟦 Étape 1: Créer un Projet Supabase

### 1.1 Créer le projet
1. Aller sur https://supabase.com
2. **Sign up** avec email + mot de passe ou GitHub
3. Cliquer **"Create a new project"**
4. Remplir:
   - **Project name**: `taxi-leblanc-prod`
   - **Database password**: Générer un mot de passe fort (sauvegardez-le!)
   - **Region**: Choisir **Europe West** (géographiquement proche de la France)
5. Cliquer **"Create new project"** → attendre 2-3 minutes

### 1.2 Récupérer les URLs de connexion
Une fois le projet créé:
1. Aller à **Settings** (icône engrenage) → **Database**
2. Vous verrez 3 sections:
   - **Connection string** (direct, port 5432)
   - **Transaction Pooler** (pooled, port 6543)
   - **Session Pooler** (pooled, port 6543)

**Copier:**
- **Transaction Pooler** URI → `DATABASE_URL` (pour Vercel)
- **Connection string** → `DIRECT_URL` (pour migrations)

**Exemple:**
```
DATABASE_URL=postgresql://postgres.xyzabc:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xyzabc:[PASSWORD]@aws-0-eu-west-1.supabase.co:5432/postgres
```

⚠️ **Important**: Remplacer `[PASSWORD]` par votre mot de passe défini à la création du projet.

---

## 📊 Étape 2: Lancer la Migration de Schéma

Avant de déployer sur Vercel, créer les tables en production.

### 2.1 Vérifier les URLs localement
```bash
# Tester la connexion directe
DIRECT_URL="your-direct-url-here" npx prisma db execute --stdin < /dev/null

# Si OK, lancer la migration
DIRECT_URL="your-direct-url-here" npx prisma migrate deploy
```

### 2.2 Seed la base (optionnel)
Si vous voulez des données de test:
```bash
DIRECT_URL="your-direct-url-here" npx tsx prisma/seed.ts
```

---

## 🔧 Étape 3: Pousser le Code sur GitHub

(Déjà fait si vous avez suivi le workflow)

```bash
git push origin main
```

---

## 🚀 Étape 4: Créer un Projet Vercel

### 4.1 Créer le projet
1. Aller sur https://vercel.com
2. **Login** avec GitHub / email
3. Cliquer **"Add New..."** → **"Project"**
4. Sélectionner le repo **samzalzz/Taxi-app**
5. Cliquer **"Import"**

### 4.2 Configurer les paramètres de build
À l'écran de configuration:
- **Framework Preset**: Doit être auto-détecté comme "Next.js"
- **Root Directory**: Laisser vide (défaut)
- **Build Command**: Laisser défaut `npm run build`
- **Output Directory**: Laisser défaut

### 4.3 Ajouter les variables d'environnement
**Important**: Ajouter les env vars AVANT de cliquer Deploy!

Dans la section **Environment Variables**, ajouter:

| Clé | Valeur | Notes |
|---|---|---|
| `DATABASE_URL` | Supabase Transaction Pooler | Copier depuis Supabase Settings |
| `DIRECT_URL` | Supabase Direct Connection | Copier depuis Supabase Settings |
| `JWT_SECRET` | Générer avec `openssl rand -hex 32` | Min 32 caractères |
| `ADMIN_SECRET` | Générer avec `openssl rand -hex 32` | Min 32 caractères |
| `NEXT_PUBLIC_APP_URL` | `https://taxi-app.vercel.app` | Remplacer par votre URL Vercel |
| `NEXT_PUBLIC_BASE_URL` | `https://taxi-app.vercel.app` | Idem |
| `NEXT_PUBLIC_API_URL` | `https://taxi-app.vercel.app` | Idem |
| `NEXT_PUBLIC_APP_NAME` | `Taxi Leblanc` | Nom de l'application |
| `ALLOWED_ORIGINS` | `https://taxi-app.vercel.app` | URL Vercel pour CORS |
| `SMTP_HOST` | `smtp.gmail.com` | Pour emails (optionnel) |
| `SMTP_PORT` | `587` | Port SMTP |
| `SMTP_USER` | Votre email Gmail | Adresse email |
| `SMTP_PASS` | App password Gmail | Voir section ci-dessous |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | (optionnel) | Google Cloud Console |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | (optionnel) | Stripe Dashboard |
| `STRIPE_SECRET_KEY` | (optionnel) | Stripe Dashboard |

### 4.4 Récupérer SMTP_PASS (Gmail)
Pour l'email (optionnel mais recommandé):
1. Activer l'authentification à 2 facteurs sur votre compte Google
2. Aller à https://myaccount.google.com/apppasswords
3. Sélectionner **Mail** et **Windows Computer**
4. Copier le mot de passe généré → `SMTP_PASS`

### 4.5 Déployer
Cliquer **"Deploy"** → attendre que la build s'achève (~3-5 minutes)

---

## 👤 Étape 5: Créer le Premier Administrateur

Une fois le déploiement terminé:

1. Aller sur `https://taxi-app.vercel.app/admin/setup`
2. Remplir le formulaire:
   - **Nom complet**: Votre nom
   - **Email**: Votre email
   - **Mot de passe**: Mot de passe fort (min 8 caractères)
   - **Confirmer le mot de passe**: Identique
   - **Admin Secret**: Utiliser la valeur que vous avez mise dans `ADMIN_SECRET` sur Vercel
3. Cliquer **"Créer l'administrateur"**
4. Vous serez redirigé vers `/connexion` → entrer vos identifiants

---

## 🧪 Étape 6: Tests et Vérifications

### Test 1: Accès à la page d'accueil
```
https://taxi-app.vercel.app/
```
✅ Doit afficher la page d'accueil avec héro section

### Test 2: Login
```
https://taxi-app.vercel.app/connexion
```
✅ Tester avec les identifiants du premier admin

### Test 3: Dashboard
```
https://taxi-app.vercel.app/dashboard
```
✅ Doit afficher le dashboard utilisateur

### Test 4: Admin Panel
```
https://taxi-app.vercel.app/admin
```
✅ Doit afficher le panneau admin (si admin)

### Test 5: Créer une réservation
```
https://taxi-app.vercel.app/reserver
```
✅ Remplir le formulaire et créer une réservation
→ Vérifier dans Supabase Dashboard → **Table Editor** → Table `Booking`

### Test 6: Vérifier la base de données
1. Aller sur Supabase Dashboard
2. **Table Editor** → voir les tables créées
3. Vérifier les données (users, bookings, etc.)

---

## ⚠️ Notes Importantes

### SSE Notifications (Real-time)
- Sur **Vercel Hobby (gratuit)**: Timeout max 10s → les SSE seront coupées après 10s
- Sur **Vercel Pro**: Timeout configurable à 60s (défaut) → SSE ok
- **Workaround Hobby**: Utiliser le polling côté client (10s) au lieu de SSE

### SMTP/Email
L'envoi d'email pour les réinitialisations de mot de passe nécessite:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` configurés
- Sans ces vars, les emails échoueront silencieusement (pas d'erreur Vercel, juste pas d'envoi)

### Domaine Personnalisé
Pour utiliser votre propre domaine:
1. Dans Vercel → **Project Settings** → **Domains**
2. Ajouter votre domaine
3. Configurer les DNS records chez votre registraire

---

## 🔍 Troubleshooting

### Erreur: "PrismaClient not found"
**Cause**: `postinstall` n'a pas généré le client Prisma  
**Fix**: Vérifier que `"postinstall": "prisma generate"` est dans `package.json`

### Erreur: "DATABASE_URL not found"
**Cause**: Variables d'environnement non configurées sur Vercel  
**Fix**: Aller dans **Project Settings** → **Environment Variables** → ajouter les vars

### Erreur: "Could not reach database"
**Cause**: DATABASE_URL incorrect ou Supabase indisponible  
**Fix**: 
- Vérifier l'URL est correcte dans Vercel env vars
- Vérifier sur Supabase que le projet est actif (Settings → Overview)

### Erreur: "CORS error"
**Cause**: ALLOWED_ORIGINS ne contient pas l'URL Vercel  
**Fix**: S'assurer que `ALLOWED_ORIGINS` = `https://taxi-app.vercel.app` (remplacer par l'URL réelle)

### Notifications SSE coupées après 10s
**Cause**: Vercel Hobby a un max de 10s  
**Fix**: 
- Upgrader à Vercel Pro
- Ou implémenter le polling côté client

---

## 📈 Monitoring et Logs

### Vercel Logs
1. Dashboard Vercel → **Project** → **Deployments**
2. Cliquer sur le dernier déploiement
3. Onglet **Logs** pour voir les erreurs/logs

### Supabase Logs
1. Dashboard Supabase → **Logs**
2. Voir les requêtes PostgreSQL, erreurs de connexion, etc.

### Vérifier les Erreurs du Build
```bash
# Affiche les erreurs du dernier deploy
vercel logs --follow
```

---

## 🔄 Mettre à Jour en Production

Pour pousser une nouvelle version:

```bash
# 1. Commit les changements
git add -A
git commit -m "Feature: add something"

# 2. Push sur GitHub
git push origin main

# 3. Vercel redéploie automatiquement (webhook GitHub)
# Vérifier sur https://vercel.com → Deployments

# 4. Si migration DB nécessaire (Prisma)
# Lancer manuellement via webhook ou Vercel Env:
DIRECT_URL="..." npx prisma migrate deploy
```

---

## 🎉 Félicitations!

Votre application Taxi Leblanc est maintenant en production sur Vercel + Supabase!

**URLs importantes:**
- **App**: https://taxi-app.vercel.app (remplacer par votre URL)
- **Supabase**: https://app.supabase.com/project/...
- **Vercel**: https://vercel.com/...

---

## 📞 Support

Pour des problèmes:
1. Vérifier les **Vercel Logs**
2. Vérifier les **Supabase Logs**
3. Vérifier les **Environment Variables** (typos?)
4. Lire le **Troubleshooting** section ci-dessus
5. Ouvrir un issue sur GitHub: https://github.com/samzalzz/Taxi-app/issues
