const { loadEnv, defineConfig } = require('@medusajs/framework/utils')

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "https://rebbies-store.vercel.app,http://localhost:3002",
      adminCors: process.env.ADMIN_CORS || "https://darling-bublanina-92fba5.netlify.app,https://rebbies-store.vercel.app",
      authCors: process.env.AUTH_CORS || "https://darling-bublanina-92fba5.netlify.app,https://rebbies-store.vercel.app",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
      session: {
        name: "medusa-session", 
        resave: false,
        rolling: false,
        saveUninitialized: false,
        proxy: true,
        cookie: {
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
      },
    }
  },
  admin: {
    disable: true,
    path: "/",
    backendUrl: "https://rebbies-store-y5cp.onrender.com",
  },
  modules: [
    // Authentication Module for customer login/register (v2.8.5 compatible)
    {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
            options: {
              // Email/password authentication for customers
            }
          }
        ]
      }
    },
    
    // Payment Module with Nigerian providers
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          // System/Manual payment provider (built-in)
          // This is automatically available as pp_system
          
          // Paystack payment provider
          {
            resolve: "medusa-payment-paystack",
            id: "paystack",
            options: {
              secret_key: process.env.PAYSTACK_SECRET_KEY || "",
              disable_retries: false, // Keep retries enabled for production
            },
          },
        ],
      },
    },
  ],
})