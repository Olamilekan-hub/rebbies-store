const { loadEnv, defineConfig } = require('@medusajs/framework/utils')

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    disable: false,
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