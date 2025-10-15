# ⚡ Quick Deployment Checklist

Print this and check off as you go! ✓

---

## 🗄️ DATABASE (PlanetScale) - 20 min

□ Sign up at planetscale.com
□ Create new database: `rebbie-store-db`
□ Create password
□ Copy connection string (Prisma format)
□ Save connection string to notepad

**Connection String Format:**
```
mysql://username:password@aws.connect.psdb.cloud/rebbie-store-db?sslaccept=strict
```

---

## 🔧 BACKEND (Render) - 30 min

□ Push code to GitHub
□ Sign up at render.com
□ Create new Web Service
□ Connect GitHub repository
□ Set Root Directory: `rebbie-store/server`
□ Set Build Command: `npm install && npx prisma generate`
□ Set Start Command: `node app.js`

### Environment Variables to Add:

□ `DATABASE_URL` = [PlanetScale connection string]
□ `NODE_ENV` = `production`
□ `PORT` = `10000`
□ `JWT_SECRET` = [generate with: `openssl rand -hex 32`]
□ `NEXTAUTH_SECRET` = [generate with: `openssl rand -hex 32`]
□ `NEXTAUTH_URL` = `https://your-app.vercel.app` (will update later)
□ `FRONTEND_URL` = `https://your-app.vercel.app` (will update later)
□ `SMTP_HOST` = `smtp.gmail.com`
□ `SMTP_PORT` = `587`
□ `SMTP_USER` = [your gmail]
□ `SMTP_PASS` = [gmail app password]
□ `EMAIL_FROM` = `noreply@rebbiestore.com`
□ `PAYSTACK_PUBLIC_KEY` = [your key]
□ `PAYSTACK_SECRET_KEY` = [your key]

□ Click "Create Web Service"
□ Wait for deployment (5-10 min)
□ Copy backend URL: ___________________________
□ Open Shell in Render
□ Run: `npx prisma migrate deploy`
□ Test: Visit `https://your-backend.onrender.com/health`

---

## 🎨 FRONTEND (Vercel) - 15 min

□ Sign up at vercel.com
□ Click "Add New Project"
□ Import your GitHub repository
□ Set Root Directory: `rebbie-store`
□ Set Framework: Next.js

### Environment Variables to Add:

□ `NEXTAUTH_SECRET` = [same as backend]
□ `NEXTAUTH_URL` = `https://your-app.vercel.app` (will update later)
□ `NEXT_PUBLIC_API_URL` = [your Render backend URL]
□ `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` = [your key]

□ Click "Deploy"
□ Wait for deployment (3-5 min)
□ Copy Vercel URL: ___________________________

### Update Backend URLs:

□ Go back to Render
□ Update `NEXTAUTH_URL` with your Vercel URL
□ Update `FRONTEND_URL` with your Vercel URL
□ Save and wait for redeploy

### Update Vercel URLs:

□ Go back to Vercel Settings
□ Update `NEXTAUTH_URL` with your actual Vercel URL
□ Redeploy

---

## ✅ TESTING - 30 min

### Frontend Tests:
□ Homepage loads
□ Browse products
□ Search works
□ Add to cart
□ Register account
□ Login
□ Add to wishlist
□ Submit review
□ Dark mode toggle

### Admin Tests:
□ Login at `/admin` with: rsvault21@gmail.com
□ Create product
□ Edit product
□ View orders
□ Update order status

### Payment Test:
□ Add product to cart
□ Go to checkout
□ Fill form
□ Use test card: `4084 0840 8408 4081`
□ CVV: `408`, Expiry: `12/25`
□ Complete payment
□ Verify order created

---

## 🔐 SECURITY

□ Change admin password in production
□ Use production Paystack keys (not test)
□ Verify HTTPS enabled (automatic)
□ Check no environment variables exposed
□ Test admin route protection

---

## 📊 MONITORING

□ Enable Vercel Analytics
□ Check Render logs for errors
□ Monitor first 24 hours closely
□ Set up email alerts

---

## 🎉 LAUNCH

□ Announce on social media
□ Email your list
□ Test from different devices
□ Monitor for errors
□ Celebrate! 🎊

---

## 📞 IMPORTANT URLS

**Frontend:** _________________________________

**Backend:** _________________________________

**Admin:** _________________________________/admin

**Database:** app.planetscale.com

**Admin Email:** rsvault21@gmail.com

**Admin Password:** _________________________________

---

## 🆘 QUICK FIXES

**API not connecting:**
- Check `NEXT_PUBLIC_API_URL` in Vercel
- Check backend is running at `/health`
- Check CORS in backend

**Database error:**
- Run `npx prisma migrate deploy` in Render shell
- Check `DATABASE_URL` is correct

**Auth not working:**
- Verify `NEXTAUTH_SECRET` matches
- Check `NEXTAUTH_URL` is correct with https://
- Clear browser cookies

**Images not loading:**
- Check image URLs are absolute
- Verify CORS headers

---

## 🎯 TOTAL TIME: ~1.5 hours

**Monthly Cost:** $0-12 (Free tier available)

---

**Date Deployed:** ___/___/______

**Deployed By:** _________________________________

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
