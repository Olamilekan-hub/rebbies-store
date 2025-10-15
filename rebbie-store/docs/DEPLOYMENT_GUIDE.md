# 🚀 Complete Deployment Guide - Vercel + Render + PlanetScale

This guide will walk you through deploying Rebbie's Store to production using:
- **Vercel** (Frontend - Next.js)
- **Render** (Backend - Node.js API)
- **PlanetScale** (Database - MySQL)

---

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] GitHub account
- [ ] Vercel account (sign up at vercel.com)
- [ ] Render account (sign up at render.com)
- [ ] PlanetScale account (sign up at planetscale.com)
- [ ] Your code pushed to GitHub repository
- [ ] Admin email configured
- [ ] Paystack API keys (test or production)

---

## PART 1: DATABASE SETUP (PlanetScale) - 20 minutes

### Step 1: Create PlanetScale Database

1. **Go to PlanetScale Dashboard**
   - Visit: https://planetscale.com
   - Click "Sign Up" or "Log In"
   - Click "New Database"

2. **Configure Database**
   ```
   Database Name: rebbie-store-db
   Region: Choose closest to your users (e.g., AWS us-east-1)
   Plan: Hobby (FREE - 5GB storage)
   ```

3. **Click "Create Database"**

### Step 2: Get Database Connection String

1. **Create a Password**
   - Go to "Settings" → "Passwords"
   - Click "New Password"
   - Name: `production-password`
   - Click "Create Password"

2. **Copy Connection String**
   - Select "Prisma" from dropdown
   - Copy the connection string (looks like):
   ```
   mysql://username:password@aws.connect.psdb.cloud/rebbie-store-db?sslaccept=strict
   ```
   
   **⚠️ SAVE THIS! You can't see it again.**

3. **Save to a temporary file** (you'll need it for backend deployment)

---

## PART 2: BACKEND DEPLOYMENT (Render) - 30 minutes

### Step 1: Prepare Your Backend Code

1. **Create a `render.yaml` file in your server folder**

Open `rebbie-store/server/render.yaml` and add:

```yaml
services:
  - type: web
    name: rebbie-store-api
    env: node
    region: oregon
    plan: starter
    buildCommand: npm install && npx prisma generate
    startCommand: node app.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: NEXTAUTH_SECRET
        generateValue: true
      - key: NEXTAUTH_URL
        sync: false
      - key: PORT
        value: 3001
      - key: FRONTEND_URL
        sync: false
```

2. **Update `package.json` in server folder**

Add these scripts if not present:

```json
{
  "scripts": {
    "start": "node app.js",
    "build": "npx prisma generate",
    "deploy": "npx prisma migrate deploy"
  }
}
```

3. **Commit and push to GitHub**

```bash
cd rebbie-store
git add .
git commit -m "Add Render configuration"
git push origin main
```

### Step 2: Deploy Backend to Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository**
   - Click "Connect GitHub"
   - Select your repository
   - Click "Connect"

3. **Configure Service**
   ```
   Name: rebbie-store-api
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: rebbie-store/server
   Runtime: Node
   Build Command: npm install && npx prisma generate
   Start Command: node app.js
   Plan: Free (or Starter $7/month for better performance)
   ```

4. **Add Environment Variables**

Click "Advanced" → "Add Environment Variable" and add these:

```env
DATABASE_URL=mysql://your-planetscale-connection-string
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars
NEXTAUTH_URL=https://your-vercel-app.vercel.app
FRONTEND_URL=https://your-vercel-app.vercel.app

# Email (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=noreply@rebbiestore.com

# Paystack
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx
```

**How to generate secrets:**
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. **Click "Create Web Service"**

Render will now:
- Install dependencies
- Generate Prisma client
- Start your server

**Wait 5-10 minutes for deployment to complete.**

6. **Copy Your Backend URL**

Once deployed, copy the URL (e.g., `https://rebbie-store-api.onrender.com`)

### Step 3: Run Database Migrations

1. **Go to Render Dashboard**
   - Select your service
   - Click "Shell" tab

2. **Run Migration Command**
   ```bash
   npx prisma migrate deploy
   ```

3. **Seed Demo Data (Optional)**
   ```bash
   node utills/insertDemoData.js
   ```

**✅ Backend is now live!**

Test it: Visit `https://your-backend-url.onrender.com/health`

---

## PART 3: FRONTEND DEPLOYMENT (Vercel) - 15 minutes

### Step 1: Prepare Frontend Code

1. **Update API URL in code** (if hardcoded anywhere)

In `rebbie-store/lib/api.ts`, ensure it uses environment variable:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

2. **Create `vercel.json` in rebbie-store folder**

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-render-backend.onrender.com/api/:path*"
    }
  ]
}
```

3. **Commit and push**

```bash
git add .
git commit -m "Add Vercel configuration"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended for beginners)**

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: rebbie-store
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables**

Click "Environment Variables" and add:

```env
NEXTAUTH_SECRET=same-as-backend-nextauth-secret
NEXTAUTH_URL=https://your-vercel-app.vercel.app
NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
```

5. **Click "Deploy"**

Vercel will:
- Install dependencies
- Build your Next.js app
- Deploy to CDN

**Wait 3-5 minutes for deployment.**

6. **Update NEXTAUTH_URL**

After first deployment:
- Copy your Vercel URL (e.g., `rebbie-store.vercel.app`)
- Go back to "Settings" → "Environment Variables"
- Update `NEXTAUTH_URL` to your actual Vercel URL
- Redeploy

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from rebbie-store folder
cd rebbie-store
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: rebbie-store
# - Directory: ./
# - Override settings? No

# Add environment variables via dashboard
# Then deploy to production
vercel --prod
```

### Step 3: Update Backend CORS Settings

1. **Go to Render Dashboard**
   - Select your backend service
   - Go to "Environment"

2. **Update `FRONTEND_URL`**
   ```
   FRONTEND_URL=https://your-actual-vercel-url.vercel.app
   ```

3. **Click "Save Changes"**

Render will automatically redeploy.

### Step 4: Configure Custom Domain (Optional)

**On Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `rebbiestore.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

**Update Environment Variables:**
- Update `NEXTAUTH_URL` to your custom domain
- Update `FRONTEND_URL` in Render to match

---

## PART 4: FINAL CONFIGURATION - 15 minutes

### Step 1: Update Admin User

1. **Connect to PlanetScale Database**

Using PlanetScale Console or MySQL client:

```sql
-- Update admin password (use bcrypt hash)
-- Generate hash: https://bcrypt-generator.com/

UPDATE User 
SET password = '$2a$10$YourBcryptHashHere'
WHERE email = 'rsvault21@gmail.com';
```

Or via Render Shell:

```bash
node -e "
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your-new-secure-password', 10);
console.log(hash);
"
```

### Step 2: Test Everything

**Frontend Tests:**
- [ ] Visit your Vercel URL
- [ ] Browse products
- [ ] Register new account
- [ ] Log in
- [ ] Add to cart
- [ ] Checkout flow
- [ ] Submit review
- [ ] Dark mode toggle

**Admin Tests:**
- [ ] Log in as admin
- [ ] Create product
- [ ] Edit product
- [ ] Delete product
- [ ] View orders
- [ ] Update order status

**Payment Tests:**
- [ ] Use Paystack test card:
  ```
  Card: 4084 0840 8408 4081
  CVV: 408
  Expiry: 12/25
  PIN: 0000
  OTP: 123456
  ```

### Step 3: Enable Production Paystack Keys

1. **Get Production Keys**
   - Go to Paystack Dashboard
   - Settings → API Keys & Webhooks
   - Copy Live Public Key and Secret Key

2. **Update Environment Variables**

**In Render (Backend):**
```env
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx
```

**In Vercel (Frontend):**
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
```

3. **Redeploy Both Services**

### Step 4: Set Up Monitoring

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Commit and push** - Vercel will auto-deploy.

---

## 🎯 POST-DEPLOYMENT CHECKLIST

### Immediate Testing (First 30 minutes):
- [ ] Homepage loads correctly
- [ ] All images display
- [ ] Navigation works
- [ ] Search functionality
- [ ] User registration
- [ ] User login
- [ ] Add to cart
- [ ] Checkout process
- [ ] Payment (use test mode first)
- [ ] Order confirmation
- [ ] Admin login
- [ ] Admin CRUD operations

### Performance Checks:
- [ ] Page load speed (should be <3 seconds)
- [ ] Mobile responsiveness
- [ ] Dark mode works
- [ ] All API calls working
- [ ] No console errors

### Security Checks:
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables not exposed
- [ ] Admin routes protected
- [ ] CORS configured correctly
- [ ] Rate limiting working

---

## 🐛 TROUBLESHOOTING

### Frontend Issues:

**Problem: "API request failed"**
```
Solution:
1. Check NEXT_PUBLIC_API_URL in Vercel env variables
2. Verify backend is running (visit /health endpoint)
3. Check CORS settings in backend
4. Check browser console for specific error
```

**Problem: "Authentication not working"**
```
Solution:
1. Verify NEXTAUTH_SECRET matches on both frontend and backend
2. Check NEXTAUTH_URL is correct (with https://)
3. Clear browser cookies and try again
4. Check backend /api/auth endpoint is accessible
```

**Problem: "Images not loading"**
```
Solution:
1. Check image URLs are absolute (not relative)
2. Verify CORS headers allow image domain
3. Use Next.js Image component properly
4. Check browser console for 404 errors
```

### Backend Issues:

**Problem: "Database connection failed"**
```
Solution:
1. Verify DATABASE_URL is correct in Render
2. Check PlanetScale database is running
3. Ensure connection string has ?sslaccept=strict
4. Check database user has permissions
```

**Problem: "500 Internal Server Error"**
```
Solution:
1. Check Render logs (Dashboard → Logs tab)
2. Look for specific error messages
3. Verify all environment variables are set
4. Check Prisma client is generated (npm run build)
```

**Problem: "CORS error"**
```
Solution:
1. Update FRONTEND_URL in Render env variables
2. Check allowedOrigins array in app.js
3. Ensure credentials: true in CORS config
4. Redeploy backend after changes
```

### Database Issues:

**Problem: "Table doesn't exist"**
```
Solution:
1. Run migrations: npx prisma migrate deploy
2. Check Render Shell for migration logs
3. Verify DATABASE_URL is correct
4. Try: npx prisma db push (as fallback)
```

**Problem: "Reviews not working"**
```
Solution:
1. Ensure migration ran successfully
2. Check Prisma schema has Review model
3. Run: npx prisma generate
4. Restart backend service
```

---

## 📊 MONITORING & MAINTENANCE

### Daily (First Week):

1. **Check Error Logs**
   - Render: Dashboard → Logs
   - Vercel: Dashboard → Logs
   - Look for 500 errors, crashes

2. **Monitor Performance**
   - Vercel Analytics dashboard
   - Check load times
   - Monitor API response times

3. **Test Critical Flows**
   - User registration
   - Checkout
   - Payment processing
   - Admin functions

### Weekly:

1. **Database Backup**
   ```bash
   # PlanetScale automatically backs up
   # But you can create manual backup:
   # Dashboard → Backups → Create Backup
   ```

2. **Review Analytics**
   - User signups
   - Order volume
   - Most viewed products
   - Conversion rate

3. **Update Dependencies**
   ```bash
   npm outdated
   npm update
   ```

### Monthly:

1. **Security Updates**
   - Update Node.js version
   - Update npm packages
   - Review Dependabot alerts

2. **Performance Optimization**
   - Analyze slow queries
   - Optimize images
   - Review API response times

3. **Feature Planning**
   - User feedback
   - Analytics insights
   - New features

---

## 🚀 SCALING TIPS

### When You Grow:

**Upgrade Render Plan:**
- Free → Starter ($7/month) for better performance
- Starter → Standard ($25/month) for more resources

**Upgrade PlanetScale:**
- Hobby (Free) → Scaler ($29/month) for more storage
- Enable Query Insights for optimization

**Add CDN for Images:**
- Move product images to Cloudinary
- Faster loading worldwide
- Image optimization automatic

**Add Caching:**
- Redis for session storage
- API response caching
- Product data caching

---

## ✅ DEPLOYMENT COMPLETE!

### Your Live URLs:

**Frontend (Vercel):**
```
https://your-app.vercel.app
```

**Backend (Render):**
```
https://rebbie-store-api.onrender.com
```

**Admin Dashboard:**
```
https://your-app.vercel.app/admin
Email: rsvault21@gmail.com
Password: [your-secure-password]
```

### Next Steps:

1. **Add Custom Domain** (Optional)
   - Buy domain (Namecheap, Google Domains)
   - Configure DNS in Vercel
   - Update environment variables

2. **Set Up Email Marketing**
   - Mailchimp integration
   - Newsletter signup
   - Order confirmations

3. **Enable Analytics**
   - Google Analytics
   - Facebook Pixel
   - Conversion tracking

4. **Launch Marketing**
   - Social media posts
   - Email announcement
   - Influencer outreach

---

## 🎉 CONGRATULATIONS!

Your e-commerce store is now live on the internet! 🚀

**Total Deployment Time:** ~1.5 hours
**Monthly Cost:** $0-12 (Free tier available)

### Share Your Success:
- Tweet about your launch
- Post on LinkedIn
- Share with friends
- Get first customers!

---

## 📞 SUPPORT RESOURCES

**Vercel Support:**
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/next.js/discussions
- Email: support@vercel.com

**Render Support:**
- Documentation: https://render.com/docs
- Community: https://community.render.com
- Email: support@render.com

**PlanetScale Support:**
- Documentation: https://planetscale.com/docs
- Community: https://planetscale.com/community
- Email: support@planetscale.com

**Paystack Support:**
- Documentation: https://paystack.com/docs
- Email: techsupport@paystack.com
- Phone: +234 1 888 3888

---

**Good luck with your store! You've got this! 🎉🚀**
