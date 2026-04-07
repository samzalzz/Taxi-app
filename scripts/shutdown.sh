#!/bin/bash

# Shutdown all servers (frontend and backend)
echo "🛑 Shutting down all servers..."

# Kill all Node.js processes
pkill -f "node|next" 2>/dev/null || true

# Alternative for Windows
taskkill /F /IM node.exe 2>/dev/null || true

# Kill by port if still running
powershell -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" 2>/dev/null || true

sleep 2

echo "✅ All servers shut down"
