const { loadEnv, defineConfig } = require('@medusajs/framework/utils')

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000,https://rebbies-store.vercel.app",
      adminCors: process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,https://rebbies-store.vercel.app",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    disable: true,
    path: "/app",
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