const { loadEnv, defineConfig } = require('@medusajs/framework/utils')

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "https://rebbies-store.vercel.app",
      adminCors: process.env.ADMIN_CORS || "https://darling-bublanina-92fba5.netlify.app,https://rebbies-store.vercel.app",
      authCors: process.env.AUTH_CORS || "https://darling-bublanina-92fba5.netlify.app,https://rebbies-store.vercel.app",
      cors: {
        credentials: true,
        origin: ["https://darling-bublanina-92fba5.netlify.app", "https://rebbies-store.vercel.app"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-medusa-access-token"],
      },
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
      session: {
        name: "medusa-session",
        resave: false,
        rolling: true,
        saveUninitialized: true,
        proxy: true,
        cookie: {
          sameSite: "none",
          secure: true, // Always true for sameSite: "none"
          httpOnly: false, // Allow JavaScript access for better mobile compatibility
          maxAge: 24 * 60 * 60 * 1000,
          domain: undefined, // Let browser handle domain automatically
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