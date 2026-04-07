# 🚀 Quick Start: Déploiement en 15 Minutes

**TL;DR pour les impatients**

---

## 1️⃣ Supabase (5 min)

```bash
# 1. Créer projet sur https://supabase.com
# 2. Attendre que le projet soit créé
# 3. Settings → Database → Connection Pooling
# 4. Copier:
#    - Transaction Pooler (port 6543) → DATABASE_URL
#    - Direct Connection (port 5432) → DIRECT_URL

# 5. Lancer la migration
export DIRECT_URL="votre-direct-url"
npx prisma migrate deploy
```

---

## 2️⃣ GitHub Push (1 min)

```bash
git push origin main
```

---

## 3️⃣ Vercel (5 min)

1. https://vercel.com → **Add New** → **Project**
2. Sélectionner `samzalzz/Taxi-app`
3. Ajouter env vars (voir table ci-dessous)
4. Cliquer **Deploy**

### Variables d'Env Essentielles

```
DATABASE_URL = supabase-pooler-url
DIRECT_URL = supabase-direct-url
JWT_SECRET = openssl rand -hex 32
ADMIN_SECRET = openssl rand -hex 32
NEXT_PUBLIC_APP_URL = https://xxx.vercel.app
NEXT_PUBLIC_BASE_URL = https://xxx.vercel.app
NEXT_PUBLIC_API_URL = https://xxx.vercel.app
NEXT_PUBLIC_APP_NAME = Taxi Leblanc
ALLOWED_ORIGINS = https://xxx.vercel.app
```

---

## 4️⃣ Premier Admin (2 min)

```
Aller sur: https://xxx.vercel.app/admin/setup
Remplir le formulaire avec:
- Email
- Mot de passe
- ADMIN_SECRET (même valeur que dans Vercel)
Cliquer "Créer l'administrateur"
```

---

## 5️⃣ Vérifier

```bash
# Test 1: Page d'accueil
https://xxx.vercel.app/

# Test 2: Login
https://xxx.vercel.app/connexion

# Test 3: Dashboard
https://xxx.vercel.app/dashboard

# Test 4: Booking (Supabase)
https://xxx.vercel.app/reserver
→ Vérifier dans Supabase Table Editor
```

---

## ⚠️ Si ça Échoue

| Erreur | Cause | Fix |
|---|---|---|
| "PrismaClient not found" | postinstall manquant | Déjà corrigé dans le code |
| "DATABASE_URL not found" | Env var manquante | Ajouter dans Vercel Settings |
| "Could not reach database" | URL incorrect | Copier exactement depuis Supabase |
| Vercel build ❌ | Voir les logs | https://vercel.com → Deployments → Logs |

---

## 📖 Pour les Détails

Voir `docs/DEPLOYMENT_VERCEL_SUPABASE.md`

---

**C'est tout! 🎉**
