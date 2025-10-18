#!/bin/bash

echo "🔍 Rebbie's Store Deployment Diagnostics"
echo "========================================"

echo ""
echo "📁 Current Directory: $(pwd)"
echo "🌐 Node Version: $(node --version)"
echo "📦 NPM Version: $(npm --version)"

echo ""
echo "🔧 Environment Variables:"
echo "NODE_ENV: ${NODE_ENV:-'Not set'}"
echo "NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-'Not set'}"
echo "NEXTAUTH_URL: ${NEXTAUTH_URL:-'Not set'}"
echo "FRONTEND_URL: ${FRONTEND_URL:-'Not set'}"

echo ""
echo "📋 Current Configuration:"
if [ -f "lib/config.ts" ]; then
    echo "✅ Config file exists"
    grep -A 3 "apiBaseUrl:" lib/config.ts || echo "❌ Could not read config"
else
    echo "❌ Config file not found"
fi

echo ""
echo "🌐 Testing Local Backend Connection..."
if command -v curl &> /dev/null; then
    if curl -s http://localhost:3001/health > /dev/null; then
        echo "✅ Local backend is running"
        curl -s http://localhost:3001/health | head -n 1
    else
        echo "❌ Local backend not responding"
    fi
else
    echo "⚠️ curl not available for testing"
fi

echo ""
echo "📦 Package.json Scripts:"
if [ -f "package.json" ]; then
    npm run | grep -E "(dev|build|start)" || echo "No relevant scripts found"
else
    echo "❌ package.json not found"
fi

echo ""
echo "🔍 Diagnosis Complete!"
echo ""
echo "Next steps:"
echo "1. Set NEXT_PUBLIC_API_URL to your Render backend URL"
echo "2. Visit https://rebbie-store-7j9y.vercel.app/test-connection"
echo "3. Follow the DEPLOYMENT_CHECKLIST.md guide"
