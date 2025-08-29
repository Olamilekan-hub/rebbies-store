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
      cors: {
        credentials: true,
        origin: function (origin, callback) {
          const allowedOrigins = [
            "https://darling-bublanina-92fba5.netlify.app",
            "https://rebbies-store.vercel.app"
          ];
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: [
          "Content-Type", 
          "Authorization", 
          "x-medusa-access-token",
          "Cookie",
          "Set-Cookie"
        ],
      },
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
      session: {
        name: "medusa-session",
        resave: false,
        rolling: false,
        saveUninitialized: false,
        proxy: true,
        cookie: {
          sameSite: "none",
          secure: true,
          httpOnly: false,
          maxAge: 30 * 60 * 1000, // 30 minutes
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
    // Authentication Module for customer login/register
    {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
            options: {}
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