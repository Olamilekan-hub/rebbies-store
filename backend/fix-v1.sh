# Stop current server (Ctrl+C)

# 1. Completely recreate database
dropdb -U postgres rebbies_store_db
createdb -U postgres rebbies_store_db

# 2. Clean everything
rm -rf dist .medusa

# 3. Create ultra-minimal config
cat > medusa-config.js << 'EOF'
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  projectConfig: {
    jwt_secret: "supersecret",
    cookie_secret: "supersecret", 
    store_cors: "http://localhost:3000",
    database_url: process.env.DATABASE_URL || "postgres://postgres:password@localhost/rebbies_store_db",
    admin_cors: "http://localhost:7001",
  },
  plugins: [
    "medusa-fulfillment-manual",
    "medusa-payment-manual",
    {
      resolve: "@medusajs/admin",
      options: { autoRebuild: true },
    },
  ],
  modules: {
    eventBus: { resolve: "@medusajs/event-bus-local" },
    cacheService: { resolve: "@medusajs/cache-inmemory" },
  },
};
EOF

# 4. Run migrations on fresh database
npx medusa migrations run

# 5. Start server
npm run dev