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
