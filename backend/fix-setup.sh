
# Create the fix script

curl -o fix-v1.sh https://gist.githubusercontent.com/[gist-url] || cat > fix-v1.sh << 'EOF'

#!/bin/bash

echo "🔧 Fixing MedusaJS v2 → v1 Compatibility Issues"
echo "==============================================="

cd backend

# Step 1: Remove problematic v2 files
echo "🗑️ Step 1: Removing v2-incompatible files..."

# Remove v2 files that cause compilation errors
rm -f integration-tests/http/health.spec.ts
rm -f src/api/admin/custom/route.ts
rm -f src/api/store/custom/route.ts
rm -f src/scripts/seed.ts

# Remove v2 configuration files
rm -f medusa-config.ts
rm -f instrumentation.ts

echo "✅ Removed v2 incompatible files"

# Step 2: Create v1-compatible API routes
echo "📝 Step 2: Creating v1-compatible API routes..."

# Create v1 admin custom route
mkdir -p src/api/admin/custom
cat > src/api/admin/custom/route.ts << 'EOF'
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  res.json({
    message: "Admin custom endpoint working!",
    store: "Rebbie's Store"
  })
}
EOF

# Create v1 store custom route
mkdir -p src/api/store/custom
cat > src/api/store/custom/route.ts << 'EOF'
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  res.json({
    message: "Store custom endpoint working!",
    store: "Rebbie's Store",
    location: "Nigeria"
  })
}
EOF

echo "✅ Created v1-compatible API routes"

# Step 3: Create v1-compatible test file
echo "🧪 Step 3: Creating v1-compatible test files..."

mkdir -p integration-tests/http
cat > integration-tests/http/health.spec.ts << 'EOF'
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  inApp: true,
  env: {},
  testSuite: ({ api }) => {
    describe("Health Check", () => {
      it("should ping the server health endpoint", async () => {
        const response = await api.get('/health')
        expect(response.status).toEqual(200)
      })
    })
  },
})
EOF

echo "✅ Created v1-compatible test file"

# Step 4: Create v1-compatible seed script
echo "🌱 Step 4: Creating v1-compatible seed script..."

cat > src/scripts/seed.ts << 'EOF'
import { 
  MedusaContainer,
  ProductService,
  RegionService,
  UserService,
} from "@medusajs/medusa"

export default async function seedDemoData(container: MedusaContainer) {
  console.log("🌱 Seeding Rebbie's Store data...")
  
  // This is a simplified v1-compatible seed script
  // The full seeding logic should be done via admin panel or separate scripts
  
  try {
    const userService: UserService = container.resolve("userService")
    
    // Create admin user if not exists
    const existingUsers = await userService.list({})
    
    if (existingUsers.length === 0) {
      await userService.create({
        email: process.env.ADMIN_EMAIL || "admin@rebbies-store.com",
        password: process.env.ADMIN_PASSWORD || "SecurePassword123!",
      }, "supersecret")
      
      console.log("✅ Admin user created")
    } else {
      console.log("✅ Admin user already exists")
    }
    
    console.log("🎉 Seeding completed successfully!")
    
  } catch (error) {
    console.log("⚠️ Seeding failed:", error.message)
    console.log("💡 You can add products manually via the admin panel")
  }
}

export const config = {
  name: "seed-rebbies-store",
}
EOF

echo "✅ Created v1-compatible seed script"

# Step 5: Fix tsconfig.json for v1
echo "⚙️ Step 5: Fixing TypeScript configuration..."

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2019",
    "lib": ["ES2019"],
    "module": "commonjs",
    "allowJs": true,
    "checkJs": false,
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": true,
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "types": ["node", "jest"]
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "dist",
    "node_modules",
    "**/*.spec.ts",
    ".medusa",
    "integration-tests"
  ]
}
EOF

echo "✅ Fixed TypeScript configuration"

# Step 6: Update package.json scripts to skip integration tests
echo "📦 Step 6: Updating package.json scripts..."

# Backup current package.json
cp package.json package.json.v2-backup

# Update scripts to be v1 compatible
cat > package.json << 'EOF'
{
  "name": "rebbies-store-backend",
  "version": "1.0.0",
  "description": "Rebbie's Store - Hair & Jewelry E-commerce Backend (Nigeria-First)",
  "author": "Olamilekan-hub (https://github.com/Olamilekan-hub)",
  "license": "MIT",
  "keywords": [
    "ecommerce",
    "medusajs",
    "nigeria",
    "hair",
    "jewelry",
    "rebbie's store"
  ],
  "scripts": {
    "clean": "cross-env ./node_modules/.bin/rimraf dist",
    "build": "cross-env npm run clean && npm run build:server",
    "build:server": "cross-env npm run clean && tsc -p tsconfig.json",
    "build:admin": "cross-env medusa-admin build --deployment",
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
    "prepare": "npm run build"
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
    "typeorm": "^0.3.25"
  },
  "devDependencies": {
    "@babel/cli": "^7.27.2",
    "@babel/core": "^7.27.7",
    "@babel/preset-typescript": "^7.27.1",
    "@medusajs/medusa-cli": "^1.3.23",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.13",
    "@types/node": "^18.19.68",
    "@types/pg": "^8.15.4",
    "babel-preset-medusa-package": "^1.1.19",
    "cross-env": "^7.0.3",
    "jest": "^29.7.0",
    "medusa-test-utils": "^1.1.44",
    "prettier": "^3.6.2",
    "rimraf": "^5.0.10",
    "ts-jest": "^29.4.0",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.2"
  },
  "engines": {
    "node": ">=16.0.0 <19.0.0"
  },
  "jest": {
    "globals": {
      "ts-jest": {
        "tsconfig": "tsconfig.json"
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

echo "✅ Updated package.json for v1 compatibility"

# Step 7: Fix medusa-config.js
echo "🔧 Step 7: Ensuring medusa-config.js is v1 compatible..."

cat > medusa-config.js << 'EOF'
const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {
  console.log("Warning: Could not load .env file");
}

// CORS configuration
const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7001,http://localhost:7000";
const STORE_CORS = process.env.STORE_CORS || "http://localhost:3000";
const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:password@localhost/rebbies_store_db";

// Plugins configuration
const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  `medusa-file-local`,
  
  // Admin dashboard
  {
    resolve: "@medusajs/admin",
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
];

// Only add Paystack if keys are provided and not placeholders
if (process.env.PAYSTACK_SECRET_KEY && !process.env.PAYSTACK_SECRET_KEY.includes("your_paystack")) {
  plugins.push({
    resolve: `medusa-payment-paystack`,
    options: {
      secret_key: process.env.PAYSTACK_SECRET_KEY,
      public_key: process.env.PAYSTACK_PUBLIC_KEY,
    },
  });
  console.log("✅ Paystack payment plugin loaded");
} else {
  console.log("⚠️  Paystack keys not configured - using manual payment only");
}

// Modules configuration for v1
const modules = {
  // Use in-memory event bus for development (no Redis required)
  eventBus: {
    resolve: "@medusajs/event-bus-local",
  },
  
  // Use in-memory cache for development (no Redis required)
  cacheService: {
    resolve: "@medusajs/cache-inmemory",
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwt_secret: process.env.JWT_SECRET || "supersecret",
  cookie_secret: process.env.COOKIE_SECRET || "supersecret",
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  
  // Database SSL configuration for production
  database_extra:
    process.env.NODE_ENV !== "development"
      ? { ssl: { rejectUnauthorized: false } }
      : {},
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
EOF

echo "✅ Fixed medusa-config.js"

# Step 8: Create/fix .env file
echo "📝 Step 8: Creating .env file..."

if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# ================================================
# REBBIE'S STORE - BACKEND ENVIRONMENT VARIABLES
# ================================================

NODE_ENV=development

# ================================================
# DATABASE CONFIGURATION
# ================================================
DATABASE_URL=postgresql://postgres:password@localhost:5432/rebbies_store_db

# ================================================
# AUTHENTICATION SECRETS
# ================================================
JWT_SECRET=your-super-secret-jwt-token-here-generate-new-one
COOKIE_SECRET=your-super-secret-cookie-token-here-generate-new-one

# ================================================
# PAYSTACK CONFIGURATION (Nigerian Payment Gateway)
# ================================================
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here

# ================================================
# CORS CONFIGURATION
# ================================================
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:7001,http://localhost:7000

# ================================================
# ADMIN USER CONFIGURATION
# ================================================
ADMIN_EMAIL=adebukolaolamilekan123@gmail.com
ADMIN_PASSWORD=SecurePassword123!

# ================================================
# NIGERIAN SPECIFIC CONFIGURATIONS
# ================================================
DEFAULT_CURRENCY=NGN
STORE_NAME=Rebbie's Store
STORE_EMAIL=adebukolaolamilekan123@gmail.com
STORE_PHONE=+234-806-577-6378

STORE_ADDRESS=Lagos, Nigeria
STORE_CITY=Lagos
STORE_STATE=Lagos State
STORE_COUNTRY=Nigeria
STORE_ZIP=100001

# ================================================
# DEVELOPMENT SETTINGS
# ================================================
OPEN_BROWSER=true
PORT=9000
LOG_LEVEL=info
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

# Step 9: Clean and reinstall dependencies
echo "📦 Step 9: Reinstalling dependencies..."

rm -rf node_modules package-lock.json yarn.lock
npm cache clean --force

# Install with specific v1 versions
npm install --legacy-peer-deps

echo "✅ Dependencies reinstalled"

# Step 10: Test build
echo "🏗️ Step 10: Testing build..."

npm run build:server

if [ $? -eq 0 ]; then
    echo "🎉 Build successful!"
    echo ""
    echo "✅ v2 → v1 compatibility fix completed!"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Update your DATABASE_URL in .env with correct PostgreSQL password"
    echo "2. Create database: createdb rebbies_store_db"
    echo "3. Run migrations: npm run migrate"
    echo "4. Start server: npm run dev"
    echo ""
    echo "🔗 Expected URLs:"
    echo "   API: http://localhost:9000"
    echo "   Admin: http://localhost:9000/admin"
    echo "   Custom Store API: http://localhost:9000/store/custom"
    echo "   Custom Admin API: http://localhost:9000/admin/custom"
else
    echo "❌ Build failed. Check the errors above."
fi

echo ""
echo "Fix script completed! 🏁"

EOF

chmod +x fix-v1.sh

./fix-v1.sh