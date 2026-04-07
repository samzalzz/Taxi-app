#!/bin/bash

# Startup script - shutdown all and restart server on port 3000

echo "🚀 Starting Taxi Leblanc Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# First, shutdown any existing servers
echo "🛑 Shutting down any existing servers..."
pkill -f "node|next" 2>/dev/null || true
taskkill /F /IM node.exe 2>/dev/null || true

# Kill by port if still running
powershell -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" 2>/dev/null || true

sleep 2

# Start the development server
echo "📦 Starting development server on port 3000..."
export PORT=3000
npm run dev 2>&1 &

sleep 5

# Check if server started
if curl -s http://localhost:3000 >/dev/null 2>&1; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ Server is running on http://localhost:3000"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📝 Test Credentials:"
  echo "   CLIENT:  client@taxi-leblanc.fr / ClientPass123!"
  echo "   DRIVER:  chauffeur@taxi-leblanc.fr / DriverPass123!"
  echo "   ADMIN:   admin@taxi-leblanc.fr / AdminPass123!"
  echo ""
  echo "🌐 Access at: http://localhost:3000"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
  echo "❌ Server failed to start. Check logs."
  exit 1
fi
