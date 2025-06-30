const dotenv = require("dotenv");

// Load environment variables
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
  // Handle error if .env file doesn't exist
}

// CORS configuration for Nigerian domains
const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7001,http://localhost:7000";
const STORE_CORS = process.env.STORE_CORS || "http://localhost:3000";

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost/rebbies_store_db";

// Redis configuration (optional, can use in-memory for development)
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Nigerian-specific plugins configuration
const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  
  // Paystack payment integration for Nigeria
  {
    resolve: `medusa-payment-paystack`,
    options: {
      secret_key: process.env.PAYSTACK_SECRET_KEY,
      public_key: process.env.PAYSTACK_PUBLIC_KEY,
    },
  },

  // File storage with Cloudinary (recommended for Nigerian stores)
  {
    resolve: `medusa-file-cloudinary`,
    options: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    },
  },

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

const modules = {
  // Event bus configuration
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  
  // Cache configuration
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  // JWT secret for authentication
  jwt_secret: process.env.JWT_SECRET,
  
  // Cookie secret for sessions
  cookie_secret: process.env.COOKIE_SECRET,
  
  // Store configuration for Rebbie's Store
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  
  // Additional Nigerian-specific configurations
  database_extra:
    process.env.NODE_ENV !== "development"
      ? {
          ssl: { rejectUnauthorized: false }
        }
      : {},
  
  // Redis URL (optional for local development)
  redis_url: REDIS_URL,
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};