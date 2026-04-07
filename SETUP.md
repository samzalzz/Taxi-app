# Setup Guide - Taxi Leblanc

Complete guide to set up and run the Taxi Leblanc platform locally.

## Prerequisites

- **Node.js:** 18.0 or higher ([download](https://nodejs.org))
- **npm:** 9.0 or higher (comes with Node.js)
- **PostgreSQL:** 14 or higher (local or cloud)
  - Option 1: Local PostgreSQL ([postgres.app](https://postgresapp.com), [installer](https://www.postgresql.org/download))
  - Option 2: Cloud: [Supabase](https://supabase.com), [Heroku Postgres](https://www.heroku.com/postgres), [Railway](https://railway.app)
- **Git:** For version control
- **Code Editor:** VS Code recommended

## Step 1: Install Dependencies

```bash
cd ~/Desktop/Websites/New

npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Prisma ORM
- Authentication tools (bcryptjs, jsonwebtoken)
- Form management (react-hook-form, zod)

## Step 2: Database Setup

### Option A: Local PostgreSQL

```bash
# macOS with Homebrew
brew install postgresql@15
brew services start postgresql@15

# Windows (use PostgreSQL installer)
# After installation, open pgAdmin or psql

# Create database
createdb taxi_leblanc

# Get connection string
# postgresql://username@localhost:5432/taxi_leblanc
```

### Option B: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Create new project → Choose password → Region
4. Wait for project to deploy
5. Go to `Settings` → `Database` → Copy "Connection string"
6. Replace password in URI: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`

### Option C: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy connection string from "PostgreSQL" service

## Step 3: Environment Variables

Create `.env.local` in project root:

```bash
# Database (replace with your connection string)
DATABASE_URL="postgresql://user:password@localhost:5432/taxi_leblanc"

# JWT (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET="your-generated-secret-key-here"
JWT_EXPIRY="7d"

# API URLs
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Taxi Leblanc"

# Optional: Google Maps (get key from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSy..."

# Optional: Stripe for payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

## Step 4: Create Database Tables

```bash
# Generate Prisma client
npx prisma generate

# Create tables (first time)
npx prisma migrate dev --name init

# Or: Push schema directly
npx prisma db push
```

### View Database (Optional)

```bash
# Open Prisma Studio to browse/edit data
npx prisma studio
# Opens http://localhost:5555
```

## Step 5: Start Development Server

```bash
npm run dev
```

Output should show:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) ✅

## 📝 Testing the System

### Test Signup
1. Go to http://localhost:3000/inscription
2. Fill form:
   - Nom: "Jean Dupont"
   - Email: "jean@example.com"
   - Mot de passe: "password123"
   - Téléphone: "+33 6 12 34 56 78" (optional)
3. Click "S'inscrire"
4. Should redirect to `/dashboard`

### Test Login
1. Go to http://localhost:3000/connexion
2. Email: "jean@example.com"
3. Password: "password123"
4. Click "Se connecter"
5. Should redirect to `/dashboard`

### Test API Directly

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password12345"
  }' -c cookies.txt

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password12345"
  }' -c cookies.txt

# Get current user
curl http://localhost:3000/api/auth/me -b cookies.txt

# Logout
curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt
```

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Lint code
npm run lint

# Database management
npx prisma generate   # Generate Prisma client
npx prisma migrate dev --name <migration-name>  # Create migration
npx prisma studio    # Open GUI for database
```

## 📂 File Locations

- **Auth routes:** `src/app/api/auth/*`
- **Auth pages:** `src/app/(auth)/*`
- **Database schema:** `prisma/schema.prisma`
- **User queries:** `src/persistence/queries/userQueries.ts`
- **Auth utilities:** `src/lib/auth/*`
- **useAuth hook:** `src/lib/hooks/useAuth.ts`
- **Tailwind config:** `tailwind.config.ts`
- **Environment vars:** `.env.local` (not in git)

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
Check:
- [ ] PostgreSQL is running: `psql` in terminal
- [ ] DATABASE_URL is correct
- [ ] Database exists: `\l` in psql

### "Error: Unable to find node modules"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Prisma Migration Conflicts
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Or create new migration
npx prisma migrate dev --name fix_migration
```

## 🚢 Deploying to Vercel

```bash
# 1. Push code to GitHub
git add .
git commit -m "Initial Taxi Leblanc setup"
git push origin main

# 2. Go to https://vercel.com/new
# 3. Import your GitHub repository
# 4. Add environment variables in Vercel dashboard:
#    - DATABASE_URL
#    - JWT_SECRET
#    - etc.

# 5. Click Deploy
# 6. Vercel auto-deploys on every git push
```

## 📚 Next Steps

Now that setup is complete:

1. **Phase 4:** Enhance landing page (from Stitch design)
2. **Phase 5:** Build booking flow (2-step modal)
3. **Phase 6:** Create customer dashboard
4. **Phase 7:** Add driver admin panel

See `docs/architecture.md` for system design.
See `CLAUDE.md` for project conventions.

## 💡 Tips

- Use Prisma Studio (`npx prisma studio`) to browse/edit database data
- Check `.env.local` is in `.gitignore` (never commit secrets!)
- Run `npm run lint` before committing code
- Keep TypeScript strict mode enabled (`strict: true`)
- Test auth flows in both browser and with curl

---

**Questions?** Check:
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
