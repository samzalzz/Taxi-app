#!/bin/bash

# Health check script - test if server and APIs are up

echo "🔍 Running Health Check..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

FAILED=0

# Test 1: Frontend - Check if main page loads
echo -n "✓ Testing frontend (home page)..."
if curl -s http://localhost:3000 | grep -q "Taxi Leblanc"; then
  echo " ✅ OK"
else
  echo " ❌ FAILED"
  FAILED=$((FAILED + 1))
fi

# Test 2: Login page
echo -n "✓ Testing login page..."
if curl -s http://localhost:3000/connexion | grep -q "Connexion"; then
  echo " ✅ OK"
else
  echo " ❌ FAILED"
  FAILED=$((FAILED + 1))
fi

# Test 3: Backend API - Auth endpoint
echo -n "✓ Testing backend API (/api/auth/me)..."
if curl -s http://localhost:3000/api/auth/me | grep -q "user"; then
  echo " ✅ OK"
else
  echo " ❌ FAILED"
  FAILED=$((FAILED + 1))
fi

# Test 4: Sign up page
echo -n "✓ Testing signup page..."
if curl -s http://localhost:3000/inscription | grep -q "S'inscrire"; then
  echo " ✅ OK"
else
  echo " ❌ FAILED"
  FAILED=$((FAILED + 1))
fi

# Test 5: Driver signup page
echo -n "✓ Testing driver signup page..."
if curl -s http://localhost:3000/inscription/chauffeur | grep -q "Inscription Chauffeur"; then
  echo " ✅ OK"
else
  echo " ❌ FAILED"
  FAILED=$((FAILED + 1))
fi

# Test 6: Check if server is listening on port 3000
echo -n "✓ Checking port 3000..."
if netstat -ano 2>/dev/null | grep -q ":3000.*LISTENING\|:3000.*ESTABLISHED"; then
  echo " ✅ OK"
else
  echo " ❌ FAILED"
  FAILED=$((FAILED + 1))
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 0 ]; then
  echo ""
  echo "✅ All tests passed! Server is healthy."
  echo ""
  echo "🌐 Access platform at: http://localhost:3000"
  echo ""
  exit 0
else
  echo ""
  echo "❌ $FAILED test(s) failed."
  echo ""
  echo "Troubleshooting:"
  echo "1. Run: ./scripts/startup.sh"
  echo "2. Check if port 3000 is in use: netstat -ano | grep 3000"
  echo "3. Check .env.local is configured"
  echo ""
  exit 1
fi
