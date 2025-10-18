# Render Deployment Configuration for PostgreSQL

## Update your Render service with these settings:

### Build Command:
```bash
npm install && npx prisma generate && npx prisma db push --force-reset && node utills/insertDemoData.js
```

### Alternative Build Command (if the above fails):
```bash
npm install && node deploy-postgres.js
```

### Start Command:
```bash
node app.js
```

### Environment Variables Required:
```
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
PORT=10000
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-frontend-url.vercel.app
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Why this fixes the issue:

1. **Database Provider Mismatch**: Your migrations were created for MySQL but you're now using PostgreSQL
2. **Migration Conflict**: The existing migrations use MySQL syntax that doesn't work with PostgreSQL
3. **Solution**: Use `db push` instead of `migrate deploy` for initial PostgreSQL deployment

## What `db push --force-reset` does:
- Creates the database schema directly from your Prisma schema
- Bypasses the existing MySQL migrations
- Works perfectly for PostgreSQL
- Safe for initial deployment (since it's a new database)

## After successful deployment:
Future schema changes should use normal migrations:
```bash
npx prisma migrate dev --name your-change-name
npx prisma migrate deploy
```
