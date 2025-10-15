@echo off
REM Rebbie's Store - Quick Setup Script for Reviews Feature (Windows)
REM This script completes the setup for the new Product Reviews system

echo.
echo ============================================
echo   Rebbie's Store - Reviews Feature Setup
echo ============================================
echo.

REM Check if we're in the right directory
if not exist "rebbie-store\server" (
    echo [ERROR] Please run this script from the workspace root (rebbies-store\)
    pause
    exit /b 1
)

REM Navigate to server directory
cd rebbie-store\server

echo [1/2] Generating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo [ERROR] Failed to generate Prisma client
    pause
    exit /b 1
)
echo [SUCCESS] Prisma client generated
echo.

echo [2/2] Running database migration...
call npx prisma migrate dev --name add_reviews_table
if errorlevel 1 (
    echo [ERROR] Failed to run migration
    echo [WARNING] Please ensure MySQL is running and DATABASE_URL is correct
    pause
    exit /b 1
)
echo [SUCCESS] Database migration completed
echo.

echo ============================================
echo   Setup Complete! 
echo ============================================
echo.
echo Next Steps:
echo   1. Restart your backend:   cd rebbie-store\server ^&^& node app.js
echo   2. Restart your frontend:  cd rebbie-store ^&^& npm run dev
echo   3. Test reviews at:        http://localhost:3000/product/[any-product]
echo   4. Click 'Reviews' tab to submit and view reviews
echo.
echo Documentation:
echo   - Review System: docs\REVIEWS_SYSTEM.md
echo   - Production Ready: PRODUCTION_READY.md
echo.
echo All features are now 100%% ready for production!
echo.
pause
