# 🎬 Step-by-Step Deployment Tutorial (Video Script Style)

Follow along like you're watching a YouTube tutorial!

---

## VIDEO 1: Database Setup (5 minutes)

### Scene 1: Create PlanetScale Account

**[00:00 - 00:30]**
```
1. Open browser
2. Go to: planetscale.com
3. Click "Sign up for free"
4. Use GitHub to sign up (easiest)
5. Complete verification
```

### Scene 2: Create Database

**[00:30 - 01:30]**
```
1. Click "Create a database"
2. Database name: rebbie-store-db
3. Region: Select closest to you
   (US East if targeting Nigeria/Africa)
4. Plan: Select "Hobby" (FREE)
5. Click "Create database"
6. Wait 30 seconds for creation
```

### Scene 3: Get Connection String

**[01:30 - 03:00]**
```
1. Click on your database name
2. Click "Connect" button
3. Click "Create password"
4. Name: production-password
5. Click "Create password"

⚠️ IMPORTANT: You'll see the password ONCE!

6. In "Connect with" dropdown, select "Prisma"
7. Copy the entire connection string
8. Paste in Notepad/TextEdit
9. Save as: planetscale-connection.txt
```

**Your connection string looks like:**
```
mysql://xxxx:yyyyyyy@aws.connect.psdb.cloud/rebbie-store-db?sslaccept=strict
```

✅ **Checkpoint:** You have connection string saved

---

## VIDEO 2: Backend Deployment (15 minutes)

### Scene 1: Prepare GitHub

**[00:00 - 02:00]**
```
1. Open VS Code
2. Open Terminal (Ctrl + `)
3. Run commands:

cd rebbie-store
git add .
git commit -m "Ready for production deployment"
git push origin main

4. Verify code is on GitHub
5. Go to github.com/your-username/your-repo
6. Confirm latest commit is there
```

### Scene 2: Create Render Account

**[02:00 - 03:00]**
```
1. Go to: render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (easiest)
4. Authorize Render
5. Complete onboarding
```

### Scene 3: Create Web Service

**[03:00 - 06:00]**
```
1. Click "New +"
2. Select "Web Service"
3. Click "Connect GitHub"
4. Find your repository
5. Click "Connect"

6. Fill in settings:
   Name: rebbie-store-api
   Region: Oregon (US West) or closest
   Branch: main
   Root Directory: rebbie-store/server
   Runtime: Node
   Build Command: npm install && npx prisma generate
   Start Command: node app.js
   Plan: Free (or Starter for better performance)

7. Scroll down to "Advanced"
```

### Scene 4: Add Environment Variables

**[06:00 - 10:00]**
```
Click "Add Environment Variable" for each:

1. DATABASE_URL
   Paste your PlanetScale connection string

2. NODE_ENV = production

3. PORT = 10000

4. JWT_SECRET
   Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   Paste output

5. NEXTAUTH_SECRET
   Generate same way
   Paste output

6. NEXTAUTH_URL = https://temporary-url.vercel.app
   (We'll update this later)

7. FRONTEND_URL = https://temporary-url.vercel.app
   (We'll update this later)

8. SMTP_HOST = smtp.gmail.com

9. SMTP_PORT = 587

10. SMTP_USER = your-email@gmail.com

11. SMTP_PASS = your-gmail-app-password
    (Get from: myaccount.google.com/apppasswords)

12. EMAIL_FROM = noreply@rebbiestore.com

13. PAYSTACK_PUBLIC_KEY = pk_test_xxxxx

14. PAYSTACK_SECRET_KEY = sk_test_xxxxx
```

### Scene 5: Deploy

**[10:00 - 12:00]**
```
1. Click "Create Web Service"
2. Watch logs scroll
3. Wait for "Build successful"
4. Wait for "Deploy live"
5. Copy your URL (top of page)
   Example: https://rebbie-store-api.onrender.com
6. Save this URL!
```

### Scene 6: Run Database Migration

**[12:00 - 15:00]**
```
1. On Render dashboard, click "Shell" tab
2. Type: npx prisma migrate deploy
3. Press Enter
4. Wait for "All migrations applied"
5. Type: node utills/insertDemoData.js
6. Press Enter
7. See "Demo users inserted successfully!"
8. Close shell

✅ Test: Visit your-backend-url.onrender.com/health
You should see: {"status":"OK"}
```

✅ **Checkpoint:** Backend is live and healthy

---

## VIDEO 3: Frontend Deployment (10 minutes)

### Scene 1: Deploy to Vercel

**[00:00 - 02:00]**
```
1. Go to: vercel.com
2. Click "Sign Up" (use GitHub)
3. Authorize Vercel
4. Click "Add New..."
5. Click "Project"
6. Click "Import Git Repository"
7. Find your repository
8. Click "Import"
```

### Scene 2: Configure Project

**[02:00 - 05:00]**
```
1. Framework Preset: Next.js (auto-detected)
2. Root Directory: rebbie-store
3. Build Command: (leave default)
4. Output Directory: (leave default)
5. Install Command: (leave default)

6. Click "Environment Variables"
   Add these 4 variables:

   NEXTAUTH_SECRET = [same as backend]
   
   NEXTAUTH_URL = https://your-project.vercel.app
   (Use the preview URL Vercel shows you)
   
   NEXT_PUBLIC_API_URL = [your Render backend URL]
   
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY = pk_test_xxxxx
```

### Scene 3: Deploy

**[05:00 - 08:00]**
```
1. Click "Deploy"
2. Watch build logs
3. Wait for "Building... 100%"
4. Wait for "Deployment Ready"
5. Click "Visit" button
6. Your site opens!
7. Copy the URL (top of browser)
```

### Scene 4: Update Backend URLs

**[08:00 - 10:00]**
```
1. Go back to Render dashboard
2. Click your service
3. Click "Environment"
4. Find NEXTAUTH_URL
5. Click "Edit"
6. Paste your Vercel URL
7. Click "Save"
8. Find FRONTEND_URL
9. Click "Edit"
10. Paste your Vercel URL
11. Click "Save Changes"
12. Wait for automatic redeploy

✅ Go back to Vercel
✅ Click your project
✅ Click "Settings"
✅ Click "Environment Variables"
✅ Update NEXTAUTH_URL with correct URL
✅ Click "Deployments"
✅ Click "..." on latest
✅ Click "Redeploy"
```

✅ **Checkpoint:** Both services updated and communicating

---

## VIDEO 4: Testing Everything (10 minutes)

### Scene 1: Frontend Tests

**[00:00 - 05:00]**
```
1. Visit your Vercel URL
2. Homepage loads? ✓
3. Click "Shop" - Products show? ✓
4. Use search bar - Results appear? ✓
5. Click a product - Details load? ✓
6. Click "Add to Cart" - Added? ✓
7. Click cart icon - Items there? ✓
8. Click "Register" - Form works? ✓
9. Fill out and submit - Success? ✓
10. Log in with new account - Works? ✓
```

### Scene 2: Reviews Test

**[05:00 - 07:00]**
```
1. Go to any product page
2. Scroll to "Reviews" tab
3. Click "Reviews"
4. See review form? ✓
5. Rate 5 stars
6. Write comment (min 10 chars)
7. Click "Submit Review"
8. See success message? ✓
9. See your review appear? ✓
10. Click "Helpful" button - Count increases? ✓
```

### Scene 3: Admin Tests

**[07:00 - 10:00]**
```
1. Go to: your-url.vercel.app/admin
2. Email: rsvault21@gmail.com
3. Password: admin123
4. Click "Products"
5. Click "Add New Product"
6. Fill form and save
7. See new product in list? ✓
8. Click "Orders"
9. See orders? ✓
10. Dashboard loads? ✓
```

✅ **Checkpoint:** Everything works!

---

## VIDEO 5: Going Live (5 minutes)

### Scene 1: Switch to Production Keys

**[00:00 - 03:00]**
```
1. Log into Paystack dashboard
2. Go to Settings → API Keys
3. Copy Live Public Key
4. Copy Live Secret Key

5. Update Render:
   - PAYSTACK_PUBLIC_KEY = pk_live_xxx
   - PAYSTACK_SECRET_KEY = sk_live_xxx

6. Update Vercel:
   - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY = pk_live_xxx

7. Both services redeploy automatically
```

### Scene 2: Final Security Check

**[03:00 - 04:00]**
```
1. Change admin password
2. Go to your site
3. Login as admin
4. Go to Users
5. Click on admin user
6. Change password
7. Save
8. Log out and log in with new password
```

### Scene 3: Launch!

**[04:00 - 05:00]**
```
1. Test one final checkout with real card
2. Verify order appears in admin
3. Check email confirmations work
4. Share your URL!
5. Tweet/post about launch
6. Get your first customer! 🎉
```

---

## 🎬 BONUS: Troubleshooting Scene

### Problem: "API request failed"

```
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try action that fails
4. Look for red API call
5. Check URL is correct
6. Check response error

Fix:
- Verify NEXT_PUBLIC_API_URL in Vercel
- Check backend /health endpoint works
- Update CORS in backend if needed
```

### Problem: "Can't login"

```
1. Check browser console for errors
2. Verify NEXTAUTH_SECRET matches
3. Check NEXTAUTH_URL has https://
4. Clear browser cookies
5. Try incognito mode

Fix:
- Update environment variables
- Redeploy both services
- Wait 2 minutes for propagation
```

### Problem: "Payment fails"

```
1. Check Paystack keys are correct
2. Verify using test mode first
3. Check browser console
4. Look at Render logs

Fix:
- Use test card: 4084 0840 8408 4081
- Check PAYSTACK_PUBLIC_KEY in Vercel
- Check PAYSTACK_SECRET_KEY in Render
- Verify keys are for same environment (test/live)
```

---

## 📝 YOUR DEPLOYMENT NOTES

**Date Started:** _______________

**Time Started:** _______________

**Backend URL:** _______________

**Frontend URL:** _______________

**Issues Encountered:**
1. _______________
2. _______________
3. _______________

**Solutions Applied:**
1. _______________
2. _______________
3. _______________

**Time Completed:** _______________

**Total Time:** _______________ minutes

**First Customer Date:** _______________

---

**🎉 CONGRATULATIONS! YOU'RE LIVE! 🎉**

Print this guide and follow along step-by-step!
