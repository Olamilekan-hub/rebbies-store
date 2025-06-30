import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  }
})








// import { defineConfig } from '@medusajs/framework/utils'

// export default defineConfig({
//   projectConfig: {
//     databaseUrl: process.env.DATABASE_URL,
//     http: {
//       storeCors: process.env.STORE_CORS || "http://localhost:8000,https://docs.medusajs.com,http://localhost:3000",
//       adminCors: process.env.MEDUSA_ADMIN_CORS || "http://localhost:9000, https://docs.medusajs.com,http://localhost:7001",
//       authCors: process.env.AUTH_CORS || "http://localhost:5173,http://localhost:9000,https://docs.medusajs.com,http://localhost:3000",
//       jwtSecret: process.env.JWT_SECRET || "supersecret",
//       cookieSecret: process.env.COOKIE_SECRET || "supersecret",
//     }
//   },
//   modules: [
//     // Payment provider for Paystack
//     {
//       resolve: "medusa-payment-manual",
//       options: {
//         providers: [
//           {
//             resolve: "medusa-payment-paystack",
//             id: "paystack",
//             options: {
//               secret_key: process.env.PAYSTACK_SECRET_KEY,
//               public_key: process.env.PAYSTACK_PUBLIC_KEY,
//             },
//           },
//         ],
//       },
//     },
//   ],
// })