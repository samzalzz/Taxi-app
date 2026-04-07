# Taxi Leblanc Server Scripts

Three utility scripts for managing the Taxi Leblanc development server.

## Scripts

### 1. `shutdown.sh` - Stop All Servers
Shuts down all running Node.js/Next.js processes and kills any process using port 3000.

```bash
./scripts/shutdown.sh
```

**What it does:**
- Kills all Node.js processes
- Kills all Next.js processes
- Frees port 3000
- Waits 2 seconds for processes to fully terminate

---

### 2. `startup.sh` - Start Development Server
Completely restarts the development server on port 3000.

```bash
./scripts/startup.sh
```

**What it does:**
1. Shuts down any existing servers
2. Waits 2 seconds
3. Starts the development server on port 3000
4. Displays connection information and test credentials
5. Shows success/failure message

**Output:**
```
✅ Server is running on http://localhost:3000

📝 Test Credentials:
   CLIENT:  client@taxi-leblanc.fr / ClientPass123!
   DRIVER:  chauffeur@taxi-leblanc.fr / DriverPass123!
   ADMIN:   admin@taxi-leblanc.fr / AdminPass123!
```

---

### 3. `health-check.sh` - Test Server Health
Runs comprehensive health checks on the running server.

```bash
./scripts/health-check.sh
```

**Tests performed:**
- ✓ Frontend home page loads
- ✓ Login page works
- ✓ Backend API responds (`/api/auth/me`)
- ✓ Signup page loads
- ✓ Driver signup page loads
- ✓ Port 3000 is listening

**Output:**
```
✅ All tests passed! Server is healthy.

🌐 Access platform at: http://localhost:3000
```

---

## Quick Start

```bash
# Start the server
./scripts/startup.sh

# In another terminal, check health
./scripts/health-check.sh

# Stop when done
./scripts/shutdown.sh
```

## Troubleshooting

### Port 3000 already in use
```bash
./scripts/shutdown.sh
./scripts/startup.sh
```

### Server won't start
1. Check `.env.local` exists and has DATABASE_URL
2. Ensure PostgreSQL database is running
3. Run Prisma migrations: `npx prisma migrate dev`

### Health check fails
```bash
./scripts/health-check.sh
```
Will show which tests fail. Check the logs in the terminal running the dev server.

## Test Credentials

Use these to login at http://localhost:3000/connexion:

| Role   | Email                      | Password          |
|--------|---------------------------|------------------|
| CLIENT | client@taxi-leblanc.fr    | ClientPass123!   |
| DRIVER | chauffeur@taxi-leblanc.fr | DriverPass123!   |
| ADMIN  | admin@taxi-leblanc.fr     | AdminPass123!    |

---

## Notes

- Scripts use bash - run from Git Bash, WSL, or similar on Windows
- PowerShell commands are used for Windows-specific operations (port killing)
- All scripts are non-blocking except `startup.sh` which runs the server in background
- To stop the server while it's running: `Ctrl+C` in the terminal or use `./scripts/shutdown.sh`
