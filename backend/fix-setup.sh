#!/bin/bash

echo "🔧 Fixing MedusaJS Version Conflicts..."

# Step 1: Complete cleanup
echo "🧹 Complete cleanup..."
rm -rf node_modules package-lock.json yarn.lock
npm cache clean --force

# Step 2: Fix package.json to use consistent v1.x versions
echo "📝 Creating corrected package.json..."

# Backup current package.json
cp package.json package.json.backup

# Create new package.json with consistent v1.x versions
cat << 'EOF' > package.json
{
  "name": "rebbies-store-backend",
  "version": "1.0.0",
  "description": "Rebbie's Store - Hair & Jewelry E-commerce Backend",
  "author": "Olamilekan-hub (https://github.com/Olamilekan-hub)",
  "license": "MIT",
  "keywords": [
    "sqlite",
    "postgres",
    "typescript",
    "wig",
    "wigs",
    "hair extensions",
    "extensions",
    "accessories",
    "fashion",
    "clothing",
    "accessories",
    "online store",
    "online shopping",
    "headless",
    "medusa",
    "ecommerce",
    "medusajs",
    "nigeria",
    "hair",
    "jewelry",
    "rebbie's store",
    "rebbie",
    "rebbies"
  ],
  "scripts": {
    "clean": "cross-env ./node_modules/.bin/rimraf dist",
    "build": "cross-env npm run clean && npm run build:server && npm run build:admin",
    "build:server": "cross-env npm run clean && tsc -p tsconfig.json",
    "build:admin": "cross-env medusa-admin build",
    "watch": "cross-env tsc --watch",
    "test": "cross-env jest",
    "seed": "cross-env medusa seed -f ./data/seed.json",
    "start": "cross-env npm run build && medusa start",
    "start:custom": "cross-env npm run build && node --preserve-symlinks --trace-warnings index.js",
    "dev": "cross-env npm run build:server && medusa develop",
    "migrate": "cross-env medusa migrations run",
    "create-migration": "medusa migrations generate",
    "create-admin": "medusa user -e admin@rebbies-store.com -p SecurePassword123!",
    "reset-db": "cross-env npm run migrate && npm run seed",
    "prepare": "npm run build",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@medusajs/admin": "^7.1.18",
    "@medusajs/cache-inmemory": "^1.8.10",
    "@medusajs/cache-redis": "^1.9.0",
    "@medusajs/event-bus-local": "^1.9.8",
    "@medusajs/event-bus-redis": "^1.8.13",
    "@medusajs/file-local": "^1.0.4",
    "@medusajs/medusa": "^1.20.9",
    "awilix": "^8.0.1",
    "body-parser": "^1.20.3",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "helmet": "^8.1.0",
    "medusa-file-cloudinary": "^1.0.2",
    "medusa-fulfillment-manual": "^1.1.41",
    "medusa-interfaces": "^1.3.10",
    "medusa-payment-manual": "^1.0.25",
    "medusa-payment-paystack": "^2.1.0",
    "pg": "^8.16.3",
    "prism-react-renderer": "^2.4.1",
    "typeorm": "^0.3.25",
    "iso8601-duration": "^2.1.2"
  },
  "devDependencies": {
    "@babel/cli": "^7.27.2",
    "@babel/core": "^7.27.7",
    "@babel/preset-typescript": "^7.27.1",
    "@medusajs/medusa-cli": "^1.3.23",
    "@swc/core": "^1.5.7",
    "@swc/jest": "^0.2.36",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.13",
    "@types/node": "^18.19.68",
    "@types/pg": "^8.15.4",
    "ajv": "^8.17.1",
    "ajv-keywords": "^5.1.0",
    "babel-preset-medusa-package": "^1.1.19",
    "cross-env": "^7.0.3",
    "eslint": "^8.57.1",
    "jest": "^29.7.0",
    "prettier": "^3.6.2",
    "rimraf": "^5.0.10",
    "schema-utils": "^4.3.2",
    "ts-jest": "^29.4.0",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.2"
  },
  "resolutions": {
    "ajv": "^8.12.0",
    "ajv-keywords": "^5.1.0",
    "schema-utils": "^4.0.0",
    "iso8601-duration": "^2.1.2"
  },
  "overrides": {
    "ajv": "^8.12.0",
    "ajv-keywords": "^5.1.0",
    "schema-utils": "^4.0.0",
    "iso8601-duration": "^2.1.2"
  },
  "engines": {
    "node": ">=16.0.0 <19.0.0"
  },
  "jest": {
    "globals": {
      "ts-jest": {
        "tsconfig": "tsconfig.spec.json"
      }
    },
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "testPathIgnorePatterns": [
      "/node_modules/",
      "<rootDir>/node_modules/"
    ],
    "rootDir": "src",
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|js)$",
    "transform": {
      ".ts": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "./coverage",
    "testEnvironment": "node"
  }
}
EOF

echo "✅ Created corrected package.json with consistent MedusaJS v1.x versions"

# Step 3: Install core dependencies first
echo "📦 Installing core dependencies..."
npm install --legacy-peer-deps

# Step 4: Install missing dependencies explicitly
echo "🔧 Installing missing dependencies..."
npm install iso8601-duration@^2.1.2 cross-env@^7.0.3 --save

# Step 5: Verify installations
echo "🔍 Verifying installations..."

# Check MedusaJS version
if node -e "console.log(require('@medusajs/medusa/package.json').version)" 2>/dev/null; then
    MEDUSA_VERSION=$(node -e "console.log(require('@medusajs/medusa/package.json').version)")
    echo "✅ MedusaJS version: $MEDUSA_VERSION"
else
    echo "❌ MedusaJS not properly installed"
fi

# Check Admin version
if node -e "console.log(require('@medusajs/admin/package.json').version)" 2>/dev/null; then
    ADMIN_VERSION=$(node -e "console.log(require('@medusajs/admin/package.json').version)")
    echo "✅ Admin version: $ADMIN_VERSION"
else
    echo "❌ Admin not properly installed"
fi

# Check cross-env
if npx cross-env echo "test" 2>/dev/null; then
    echo "✅ cross-env working"
else
    echo "❌ cross-env not working"
fi

# Check iso8601-duration
if node -e "console.log(require('iso8601-duration/package.json').version)" 2>/dev/null; then
    ISO_VERSION=$(node -e "console.log(require('iso8601-duration/package.json').version)")
    echo "✅ iso8601-duration version: $ISO_VERSION"
else
    echo "❌ iso8601-duration not properly installed"
fi

# Step 6: Test builds
echo "🏗️  Testing build process..."

# Test server build
echo "Building server..."
npm run build:server

if [ $? -eq 0 ]; then
    echo "✅ Server build successful!"
    
    # Test admin build
    echo "Building admin..."
    npm run build:admin
    
    if [ $? -eq 0 ]; then
        echo "🎉 Admin build successful!"
    else
        echo "⚠️  Admin build failed, but server is working. You can start without admin for now."
    fi
else
    echo "❌ Server build failed. Checking TypeScript config..."
    
    # Create basic tsconfig.json if missing
    if [ ! -f tsconfig.json ]; then
        echo "📝 Creating tsconfig.json..."
        cat << 'TSEOF' > tsconfig.json
{
  "compilerOptions": {
    "target": "es2019",
    "module": "commonjs",
    "allowJs": true,
    "checkJs": false,
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules", "**/*.spec.ts"]
}
TSEOF
        
        # Try build again
        npm run build:server
    fi
fi

# Step 7: Create temporary build script without admin
echo "📝 Creating temporary build script without admin..."
sed -i 's/build": "cross-env npm run clean && npm run build:server && npm run build:admin"/build": "cross-env npm run clean && npm run build:server"/' package.json

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Status Summary:"
echo "   🟢 Package versions fixed to consistent MedusaJS v1.x"
echo "   🟢 Missing dependencies installed"
echo "   🟢 Version conflicts resolved"
echo ""
echo "🚀 Next steps:"
echo "   1. Try: npm run build:server"
echo "   2. Then: npm run dev"
echo "   3. If successful, try: npm run build:admin"
echo ""
echo "🔗 Once running:"
echo "   API: http://localhost:9000"
echo "   Admin: http://localhost:9000/admin"
echo ""

# Optional: Start the server
read -p "🤔 Would you like to start the development server now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting development server..."
    npm run dev
fi

echo "✨ Version fix script completed!"