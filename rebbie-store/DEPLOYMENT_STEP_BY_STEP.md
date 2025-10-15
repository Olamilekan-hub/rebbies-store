# 🚀 Complete Deployment Guide: Vercel + Render + PlanetScale

## 📋 Overview

This guide will walk you through deploying Rebbie's Store to production using:
- **Vercel** - Frontend (Next.js)
- **Render** - Backend (Node.js/Express API)
- **PlanetScale** - Database (MySQL)

**Total Time:** ~90 minutes  
**Cost:** FREE (all free tiers)

---

## 📦 What You'll Need

- [ ] GitHub account
- [ ] Vercel account (sign up with GitHub)
- [ ] Render account (sign up with GitHub)
- [ ] PlanetScale account
- [ ] Paystack account (for payments)
- [ ] Gmail account (for emails)

---

# PART 1: DATABASE SETUP (PlanetScale)

**Time:** 20 minutes

## Step 1: Create PlanetScale Account

1. Go to https://planetscale.com/
2. Click **"Sign up"**
3. Sign up with GitHub (easiest option)
4. Verify your email

## Step 2: Create Database

1. Click **"Create database"**
2. Database name: `rebbie-store-db`
3. Region: Choose closest to your users (e.g., `us-east`)
4. Plan: **Free (5GB storage, 1 billion row reads/month)**
5. Click **"Create database"**

## Step 3: Get Connection String

1. Wait for database to initialize (~2 minutes)
2. Click on your database name
3. Click **"Connect"** button
4. Select **"Prisma"** from framework dropdown
5. Create a password by clicking **"New password"**
6. Name it: `production`
7. Copy the connection string - it looks like this:

```
mysql://username:password@aws.connect.psdb.cloud/rebbie-store-db?sslaccept=strict
```

8. **SAVE THIS** - You'll need it multiple times
9. Keep this tab open

---

# PART 2: BACKEND DEPLOYMENT (Render)

**Time:** 30 minutes

## Step 1: Prepare Your Code

1. Open terminal in your project:

```bash
cd c:/Users/user/Desktop/Sources/Worksssss/rebbies-store/rebbie-store
```

2. Make sure your code is committed to Git:

```bash
git status
git add .
git commit -m "Prepare for production deployment"
```

3. If you don't have a GitHub repo yet:

```bash
# Create a new repo on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/rebbie-store.git
git branch -M main
git push -u origin main
```

## Step 2: Create Render Account

1. Go to https://render.com/
2. Click **"Get Started"**
3. Sign up with GitHub
4. Authorize Render to access your repositories

## Step 3: Deploy Backend

1. On Render Dashboard, click **"New +"** → **"Web Service"**

2. Connect your GitHub repository:
   - If you don't see it, click **"Configure account"**
   - Grant access to `rebbie-store` repository
   - Click **"Connect"**

3. Configure the service:

   **Name:** `rebbie-store-backend`
   
   **Region:** Same as PlanetScale (e.g., Oregon USA)
   
   **Branch:** `main`
   
   **Root Directory:** `server`
   
   **Runtime:** `Node`
   
   **Build Command:**
   ```bash
   npm install && npx prisma generate
   ```
   
   **Start Command:**
   ```bash
   npm start
   ```
   
   **Instance Type:** `Free`

4. Click **"Advanced"** to add environment variables

## Step 4: Add Environment Variables

Click **"Add Environment Variable"** for each of these:

### Database
```
Key: DATABASE_URL
Value: mysql://username:password@aws.connect.psdb.cloud/rebbie-store-db?sslaccept=strict
```
*(Use the connection string from PlanetScale)*

### JWT & Auth
```
Key: JWT_SECRET
Value: [Generate a random string - see below]
```

```
Key: NEXTAUTH_SECRET
Value: [Same as JWT_SECRET or generate another]
```

```
Key: NEXTAUTH_URL
Value: https://rebbie-store.vercel.app
```
*(We'll update this later with your actual Vercel URL)*

### Email (Gmail SMTP)
```
Key: SMTP_HOST
Value: smtp.gmail.com
```

```
Key: SMTP_PORT
Value: 587
```

```
Key: SMTP_USER
Value: your-email@gmail.com
```

```
Key: SMTP_PASS
Value: [Your Gmail App Password - see below]
```

```
Key: EMAIL_FROM
Value: noreply@rebbiestore.com
```

### Paystack
```
Key: PAYSTACK_PUBLIC_KEY
Value: pk_test_your_public_key
```

```
Key: PAYSTACK_SECRET_KEY
Value: sk_test_your_secret_key
```

### CORS
```
Key: FRONTEND_URL
Value: https://rebbie-store.vercel.app
```
*(We'll update this later)*

### Node Environment
```
Key: NODE_ENV
Value: production
```

## Step 5: Generate Secret Keys

### For JWT_SECRET and NEXTAUTH_SECRET:

**Option 1 - Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2 - Online:**
Go to https://generate-secret.vercel.app/32

**Option 3 - Manual:**
Use a password manager to generate a 64-character random string

### For Gmail App Password:

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already)
3. Search for **"App passwords"**
4. Click **"App passwords"**
5. Select **"Mail"** and **"Other (Custom name)"**
6. Name it: `Rebbie Store`
7. Click **"Generate"**
8. Copy the 16-character password (no spaces)
9. Use this as `SMTP_PASS`

## Step 6: Deploy Backend

1. Scroll down and click **"Create Web Service"**
2. Wait for deployment (~5 minutes)
3. You'll see logs scrolling - watch for errors
4. When done, you'll see: **"Your service is live 🎉"**

## Step 7: Get Backend URL

1. At the top of the page, you'll see your URL:
   ```
   https://rebbie-store-backend.onrender.com
   ```
2. **COPY THIS URL** - you'll need it for frontend
3. Test it by visiting: `https://rebbie-store-backend.onrender.com/health`
4. You should see: `{"status":"ok"}`

## Step 8: Run Database Migration

1. In Render dashboard, click on your service
2. Go to **"Shell"** tab (left sidebar)
3. Click **"Launch Shell"**
4. Run these commands:

```bash
cd /opt/render/project/src
npx prisma migrate deploy
npx prisma generate
```

5. Wait for migration to complete
6. You should see: **"All migrations have been successfully applied"**

---

# PART 3: FRONTEND DEPLOYMENT (Vercel)

**Time:** 15 minutes

## Step 1: Create Vercel Account

1. Go to https://vercel.com/
2. Click **"Sign Up"**
3. Sign up with GitHub
4. Authorize Vercel

## Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Find your `rebbie-store` repository
3. Click **"Import"**

## Step 3: Configure Build Settings

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** Click **"Edit"** and leave it as `./` (root)

**Build Command:** 
```bash
npm run build
```

**Output Directory:** 
```
.next
```

**Install Command:**
```bash
npm install
```

## Step 4: Add Environment Variables

Click **"Environment Variables"** section:

### API Configuration
```
Key: NEXT_PUBLIC_API_URL
Value: https://rebbie-store-backend.onrender.com
```
*(Use your Render backend URL from Part 2, Step 7)*

### NextAuth
```
Key: NEXTAUTH_SECRET
Value: [Same secret you used in backend]
```

```
Key: NEXTAUTH_URL
Value: https://rebbie-store.vercel.app
```
*(Temporary - we'll update this)*

### Paystack
```
Key: NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
Value: pk_test_your_public_key
```
*(Same as backend)*

## Step 5: Deploy Frontend

1. Click **"Deploy"**
2. Wait for build (~3 minutes)
3. Watch the logs for errors
4. When done, you'll see: **"Congratulations! 🎉"**

## Step 6: Get Your Production URL

1. Vercel will show you your URL:
   ```
   https://rebbie-store-123abc.vercel.app
   ```
2. **COPY THIS URL**

## Step 7: Update Environment Variables

### Update Vercel Environment Variables:

1. Go to your project settings
2. Click **"Settings"** → **"Environment Variables"**
3. Find `NEXTAUTH_URL`
4. Click **"Edit"**
5. Change value to your actual Vercel URL:
   ```
   https://rebbie-store-123abc.vercel.app
   ```
6. Click **"Save"**

### Update Render Environment Variables:

1. Go back to Render dashboard
2. Click on your backend service
3. Click **"Environment"** (left sidebar)
4. Find `NEXTAUTH_URL`
5. Click **"Edit"**
6. Change to your Vercel URL
7. Find `FRONTEND_URL`
8. Update to your Vercel URL
9. Click **"Save Changes"**

### Update CORS in Backend Code:

1. Go to your local code
2. Open `server/app.js`
3. Find the CORS configuration (around line 20-30)
4. Update it:

```javascript
app.use(cors({
  origin: ['https://rebbie-store-123abc.vercel.app'], // Your Vercel URL
  credentials: true
}));
```

5. Commit and push:

```bash
git add .
git commit -m "Update CORS for production"
git push
```

6. Render will auto-redeploy (~2 minutes)

## Step 8: Redeploy Frontend

1. Go to Vercel dashboard
2. Click **"Deployments"** tab
3. Click **"Redeploy"** on the latest deployment
4. Check **"Use existing Build Cache"**
5. Click **"Redeploy"**

---

# PART 4: FINAL CONFIGURATION

**Time:** 15 minutes

## Step 1: Add Custom Domain (Optional)

### On Vercel:

1. Go to **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter your domain: `rebbiestore.com`
4. Follow DNS configuration instructions
5. Add these records to your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Update Environment Variables if using custom domain:

Update `NEXTAUTH_URL` and `FRONTEND_URL` everywhere to use your custom domain.

## Step 2: Test Everything

### Test Checklist:

1. **Homepage loads:**
   - Visit your Vercel URL
   - Check that products display
   - Check that categories work

2. **User Registration:**
   - Click **"Register"**
   - Create test account: `test@example.com`
   - Should receive welcome or verification

3. **Login:**
   - Click **"Login"**
   - Enter credentials
   - Should redirect to account

4. **Password Reset:**
   - Click **"Forgot Password"**
   - Enter email
   - Check email for reset link
   - Click link and reset password

5. **Shopping:**
   - Browse products
   - Search for items
   - Filter by category
   - Add to cart
   - Update quantities
   - Add to wishlist

6. **Checkout:**
   - Go to cart
   - Click **"Checkout"**
   - Fill in details
   - Click **"Pay with Paystack"**
   - Use test card: `5060666666666666666`
   - CVV: `123`, Expiry: `12/28`, OTP: `123456`
   - Payment should succeed
   - Check order in account page

7. **Product Reviews:**
   - Go to a product you "purchased"
   - Scroll to reviews
   - Submit a review
   - Should see verified badge
   - Test helpful button

8. **Admin:**
   - Logout
   - Login as admin: `rsvault21@gmail.com` / `admin123`
   - Visit `/admin`
   - Test creating a product
   - Test editing product
   - Test viewing orders
   - Test updating order status

## Step 3: Seed Production Data

If your database is empty, seed it:

1. Go to Render Shell
2. Run:

```bash
cd /opt/render/project/src
node prisma/seed.js
```

Or create products manually through admin panel.

## Step 4: Change Admin Password

**IMPORTANT:** Change the default admin password!

1. Login as admin
2. Go to admin panel
3. Click **"Users"** or **"Profile"**
4. Change password from `admin123` to something secure
5. Save changes

---

# PART 5: MONITORING & MAINTENANCE

**Time:** 10 minutes setup

## Step 1: Set Up Vercel Analytics

1. In Vercel dashboard, go to **"Analytics"** tab
2. Click **"Enable Analytics"**
3. It's automatically configured!

## Step 2: Set Up Error Tracking (Optional)

### Sentry Setup:

1. Go to https://sentry.io/
2. Sign up (free tier)
3. Create new project → **"Next.js"**
4. Follow setup wizard:

```bash
cd rebbie-store
npx @sentry/wizard@latest -i nextjs
```

5. Add Sentry DSN to Vercel environment variables
6. Commit and push

## Step 3: Set Up Uptime Monitoring

### UptimeRobot (Free):

1. Go to https://uptimerobot.com/
2. Sign up (free for 50 monitors)
3. Click **"Add New Monitor"**
4. Monitor Type: **"HTTP(s)"**
5. Friendly Name: `Rebbie Store Frontend`
6. URL: Your Vercel URL
7. Monitoring Interval: **5 minutes**
8. Add another monitor for backend:
   - URL: `https://rebbie-store-backend.onrender.com/health`

## Step 4: Set Up Backups

### PlanetScale Backups (Automatic):

1. Go to PlanetScale dashboard
2. Click your database
3. Go to **"Settings"** → **"Backups"**
4. Backups are automatic on free tier (daily)
5. To restore: Click **"Backups"** → **"Restore"**

### Manual Backup:

To manually backup your database:

1. Go to Render Shell
2. Run:

```bash
npx prisma db pull
npx prisma db push
```

Or use PlanetScale CLI to export data.

---

# 🎉 DEPLOYMENT COMPLETE!

## Your Live URLs

- **Frontend:** https://rebbie-store-123abc.vercel.app
- **Backend API:** https://rebbie-store-backend.onrender.com
- **Database:** PlanetScale Dashboard
- **Admin Panel:** https://rebbie-store-123abc.vercel.app/admin

## Important Credentials

**Admin Login:**
- Email: rsvault21@gmail.com
- Password: [Change this immediately!]

**PlanetScale:**
- Database: rebbie-store-db
- Connection: [Saved in Render environment]

**Paystack:**
- Mode: Test (use test cards)
- Dashboard: https://dashboard.paystack.com/

---

# 🔧 TROUBLESHOOTING

## Frontend Issues

### "Error: Failed to fetch"
**Cause:** Backend URL is wrong or backend is down

**Fix:**
1. Check `NEXT_PUBLIC_API_URL` in Vercel
2. Make sure backend URL is correct
3. Visit backend `/health` endpoint to verify it's running

### "NextAuth configuration error"
**Cause:** `NEXTAUTH_SECRET` or `NEXTAUTH_URL` is wrong

**Fix:**
1. Verify both are set in Vercel environment variables
2. Make sure `NEXTAUTH_URL` matches your actual Vercel URL
3. Redeploy after changing

### Images not loading
**Cause:** Next.js image domains not configured

**Fix:**
1. Edit `next.config.mjs`:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
},
```

2. Commit and push

## Backend Issues

### "Database connection error"
**Cause:** `DATABASE_URL` is wrong or PlanetScale is down

**Fix:**
1. Check PlanetScale dashboard
2. Regenerate connection string
3. Update in Render environment variables
4. Restart service

### "Port already in use"
**Cause:** Render trying to use wrong port

**Fix:**
1. Make sure `server/index.js` uses `process.env.PORT`
2. Should be: `const PORT = process.env.PORT || 3001`

### CORS errors
**Cause:** Frontend URL not in CORS whitelist

**Fix:**
1. Check `FRONTEND_URL` in Render environment variables
2. Update `server/app.js` CORS configuration
3. Commit and push (auto-redeploys)

## Payment Issues

### Paystack modal doesn't open
**Cause:** Wrong public key or script not loaded

**Fix:**
1. Verify `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` in Vercel
2. Check browser console for errors
3. Make sure Paystack script is in `app/layout.tsx`

### Payment succeeds but order not created
**Cause:** Backend webhook not receiving callback

**Fix:**
1. Check Render logs for errors
2. Verify Paystack webhook URL in Paystack dashboard:
   ```
   https://rebbie-store-backend.onrender.com/api/payment/webhook
   ```
3. Test webhook in Paystack dashboard

## Email Issues

### Password reset emails not sending
**Cause:** Gmail SMTP credentials wrong or 2FA not enabled

**Fix:**
1. Verify Gmail App Password in Render
2. Make sure 2-Step Verification is enabled
3. Generate new App Password
4. Update `SMTP_PASS` in Render

### Emails going to spam
**Cause:** Sending from Gmail without SPF/DKIM

**Fix:**
1. Use a custom domain
2. Set up SPF/DKIM records
3. Or use SendGrid/Mailgun instead of Gmail

---

# 📊 PERFORMANCE TIPS

## Speed Optimizations

1. **Enable Vercel Analytics**
   - Tracks Core Web Vitals
   - Free on all plans

2. **Compress Images**
   - Use Next.js Image component (already implemented)
   - Or upload to Cloudinary

3. **Add Caching**
   - In `next.config.mjs`:
   ```javascript
   headers: async () => [
     {
       source: '/api/:path*',
       headers: [
         {
           key: 'Cache-Control',
           value: 'public, max-age=60, stale-while-revalidate=30',
         },
       ],
     },
   ],
   ```

4. **Database Indexes**
   - Already added in Prisma schema
   - Check PlanetScale Insights for slow queries

## Cost Optimization

### Current Costs: $0/month

**Free Tier Limits:**
- Vercel: 100GB bandwidth, unlimited sites
- Render: 750 hours/month (1 service running 24/7)
- PlanetScale: 5GB storage, 1B row reads

**When you outgrow free tiers:**
- Vercel Pro: $20/month (1TB bandwidth)
- Render: $7/month per service
- PlanetScale: $29/month (Scaler plan)

**Tip:** Use Cloudinary free tier for images to save bandwidth!

---

# 🚀 NEXT STEPS

## Immediate (Week 1)

- [ ] Test all features thoroughly
- [ ] Change admin password
- [ ] Add real products (or use seed data)
- [ ] Set up uptime monitoring
- [ ] Configure custom domain
- [ ] Enable SSL (automatic on Vercel)

## Short-term (Month 1)

- [ ] Add Google Analytics
- [ ] Set up Sentry error tracking
- [ ] Implement email marketing (Mailchimp)
- [ ] Add more payment methods
- [ ] Create social media accounts
- [ ] Write product descriptions

## Long-term (Quarter 1)

- [ ] Add product image uploads to Cloudinary
- [ ] Implement advanced analytics dashboard
- [ ] Add review image uploads
- [ ] Implement order tracking with SMS
- [ ] Add customer reviews moderation
- [ ] Mobile app (React Native)

---

# 📞 SUPPORT

## Platform Support

**Vercel:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

**Render:**
- Docs: https://render.com/docs
- Status: https://status.render.com/

**PlanetScale:**
- Docs: https://planetscale.com/docs
- Discord: https://planetscale.com/discord

## Emergency Contacts

**Service Status Pages:**
- Vercel: https://www.vercel-status.com/
- Render: https://status.render.com/
- PlanetScale: https://www.planetscalestatus.com/

**Rollback Commands:**

```bash
# Vercel (via dashboard or CLI)
vercel rollback

# Render (via dashboard)
# Go to service → Deploys → Click "Rollback" on previous deploy
```

---

# ✅ FINAL CHECKLIST

## Pre-Launch

- [ ] All environment variables set
- [ ] Database migrated
- [ ] Admin password changed
- [ ] Test payment completed
- [ ] All features tested
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

## Launch Day

- [ ] Database backed up
- [ ] All services running
- [ ] No errors in logs
- [ ] Test from mobile device
- [ ] Test from different browser
- [ ] Announce on social media

## Post-Launch

- [ ] Monitor error logs daily (week 1)
- [ ] Check payment success rate
- [ ] Respond to user feedback
- [ ] Plan next features

---

**🎉 Congratulations! Your store is now live!**

Remember:
- Render free tier may sleep after inactivity (30 min to wake up)
- First request to backend may be slow (cold start)
- Consider upgrading to paid tier for better performance
- Always test in production after deployments

**Good luck with your launch! 🚀✨**
