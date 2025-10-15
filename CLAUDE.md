# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rebbie's Store** is a Nigerian e-commerce platform specializing in **hair and jewelry products**. We switched from a complex MedusaJS setup to a simpler, more maintainable architecture using a modern e-commerce template.

**Tech Stack:**
- **Framework**: Next.js 15.5.3 with TypeScript and React 18.3.1
- **Backend**: Integrated API routes (no separate backend server)
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Payments**: Paystack (to be integrated for Nigerian market)

## Project Goals & Vision

### Phase 1: Foundation Setup ✅
- [x] Clone and setup e-commerce template
- [x] Configure MySQL database with Prisma
- [x] Create admin user and authentication system
- [x] Seed demo data for testing

### Phase 2: Nigerian Market Customization 🚧
- [ ] **Design Overhaul**: Update UI/UX for hair and jewelry products
- [ ] **Paystack Integration**: Add Nigerian payment gateway
- [ ] **Currency Support**: Implement NGN currency with proper formatting
- [ ] **Shipping Zones**: Lagos, Nigeria, International shipping calculations
- [ ] **Product Categories**: Hair products, jewelry, accessories
- [ ] **Mobile Optimization**: Ensure mobile-first design for Nigerian users

### Phase 3: Business Features 📋
- [ ] **Product Management**: Hair product variants (length, texture, color)
- [ ] **Jewelry Catalog**: Size variants, material options
- [ ] **Inventory Management**: Stock tracking and low-stock alerts
- [ ] **Order Management**: Nigerian shipping addresses and zones
- [ ] **Customer Reviews**: Product rating and review system
- [ ] **Wishlist**: Save favorite products functionality

### Phase 4: Nigerian E-commerce Features 🇳🇬
- [ ] **Multi-Payment Options**: Cards, bank transfer, USSD via Paystack
- [ ] **Delivery Options**: Lagos same-day, Nigeria 2-3 days, International
- [ ] **Free Shipping Thresholds**: ₦50k Lagos, ₦100k Nigeria, ₦200k International
- [ ] **Customer Support**: WhatsApp integration for support
- [ ] **SMS Notifications**: Order updates via SMS

## Development Commands

### Current Setup (Single Codebase)
```bash
# Frontend development
npm run dev              # Start Next.js dev server (port 3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Backend/Database
cd server && node app.js # Start API server (port 5000)
npx prisma migrate dev   # Run database migrations
npx prisma generate      # Generate Prisma client
cd server/utills && node insertDemoData.js  # Seed database
```

## Architecture

### Simplified Architecture Benefits
- **Single codebase** instead of separate frontend/backend
- **API routes** in Next.js instead of separate Node.js server
- **Easier deployment** - single app vs microservices
- **Faster development** - less complexity, more focus on business logic

### Current Project Structure
```
rebbie-store/
├── app/                     # Next.js 13+ App Router
│   ├── (dashboard)/         # Admin dashboard pages
│   ├── api/                 # API endpoints (auth, products, etc.)
│   ├── (shop)/              # Customer-facing shop pages
│   └── globals.css          # Global styles
├── components/              # Reusable UI components
├── server/                  # Database utilities and API server
│   ├── prisma/              # Database schema
│   └── utills/              # Seeding scripts
├── utils/                   # Helper functions and utilities
└── store/                   # Zustand state management
```

## Current Admin Access
- **Email**: rsvault21@gmail.com
- **Password**: admin123
- **Dashboard**: http://localhost:3000/admin
- **Features**: Product management, user management, orders, categories

## Next Steps Prioritization

1. **Immediate (This Session)**:
   - Design customization for hair/jewelry theme
   - Update product categories and sample data
   - Improve admin dashboard UI

2. **Short Term (Next Sessions)**:
   - Paystack payment integration
   - NGN currency implementation
   - Nigerian shipping zones

3. **Medium Term**:
   - Product variant system for hair/jewelry
   - Mobile optimization
   - Customer features (reviews, wishlist)

## Nigerian Market Requirements

### Currency & Pricing
- Display prices in Nigerian Naira (₦)
- Store prices in kobo (smallest unit) for precision
- Support multiple currencies for international customers

### Payment Methods
- **Primary**: Paystack (Nigerian payment processor)
- **Methods**: Cards, Bank Transfer, USSD, QR codes
- **Mobile Money**: Support for popular Nigerian mobile payment options

### Shipping & Delivery
- **Lagos**: Same day delivery, ₦2,000-5,000
- **Nigeria**: 2-3 days, ₦5,000-10,000
- **International**: 7-14 days, ₦15,000+
- **Free shipping thresholds** based on location

### Customer Behavior
- **Mobile-first**: 80%+ of Nigerian users shop on mobile
- **WhatsApp**: Preferred customer support channel
- **Trust signals**: Reviews, testimonials, social proof important

## Key Files to Understand

- `app/api/`: API endpoints for backend functionality
- `server/prisma/schema.prisma`: Database schema definition
- `components/`: Reusable UI components
- `utils/db.ts`: Database connection and utilities
- `store/`: Zustand state management stores