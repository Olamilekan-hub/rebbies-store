# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rebbie's Store is a Nigerian e-commerce platform specializing in hair and jewelry products. It's built with a modern tech stack consisting of:

- **Backend**: MedusaJS v2.8.5 (Node.js e-commerce framework)
- **Frontend**: Next.js 15.3.4 with TypeScript and React 19
- **Database**: PostgreSQL  
- **Payments**: Paystack (primary Nigerian payment provider)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context (CartContext, AuthContext)

## Development Commands

### Backend (rebbie-store-backend/)
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run migrations:run   # Run database migrations
npm run seed             # Seed database with test data

# Testing
npm run test:unit                    # Run unit tests
npm run test:integration:http        # Run HTTP integration tests  
npm run test:integration:modules     # Run module integration tests
```

### Frontend (frontend/)
```bash
npm run dev     # Start development server (usually port 3000)
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Architecture & Key Patterns

### Backend Architecture (MedusaJS)
- **Modular Structure**: Uses MedusaJS modules for payments, admin, and core commerce functionality
- **API Routes**: Custom routes in `src/api/` for Nigerian-specific features (currency conversion, payment methods)
- **Payment Integration**: Configured with Paystack for Nigerian payments, with Flutterwave as secondary option
- **Webhooks**: Paystack webhook handling for payment confirmations
- **Scripts**: Database seeding and test order creation utilities

### Frontend Architecture (Next.js)
- **App Router**: Uses Next.js 13+ app directory structure
- **Component Organization**:
  - `components/auth/`: Authentication and user account components
  - `components/cart/`: Shopping cart functionality including drawer and floating button
  - `components/product/`: Product display, filtering, and related components
  - `components/landing/`: Homepage sections and marketing components
  - `components/common/`: Shared components like Header, Footer
  - `components/ui/`: Basic UI components (Button, Card, Input, Toast)

### State Management
- **CartContext**: Centralized cart state with localStorage persistence
  - Supports NGN/USD/EUR currencies
  - Nigerian shipping zones (Lagos, Nigeria, International)
  - Automatic shipping cost calculation with free shipping thresholds
- **AuthContext**: User authentication state management
- **Custom Hooks**: `useCart.ts`, `useProducts.ts` for business logic

### MedusaJS Integration
- **Client Configuration**: `frontend/src/lib/medusa.ts` provides typed API client
- **Nigerian Focus**: Default currency NGN, Nigerian regions, local payment methods
- **Key Functions**: Product fetching, cart management, category handling, price formatting

### TypeScript Types
- Custom types in `frontend/src/lib/types.ts` 
- Extends MedusaJS types with Nigerian-specific fields
- Product variants, cart items, and regional data models

## Important Configuration

### Environment Variables
**Backend** requires:
- `DATABASE_URL`: PostgreSQL connection
- `PAYSTACK_SECRET_KEY`: Paystack payment integration
- `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`: CORS configuration

**Frontend** requires:
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL`: Backend API URL (default: http://localhost:9000)
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`: MedusaJS store key

### Regional Settings
- Primary market: Nigeria (NGN currency)
- Shipping zones: Lagos (₦2,000), Nigeria (₦5,000), International (₦15,000)
- Free shipping thresholds: Lagos ₦50,000, Nigeria ₦100,000, International ₦200,000

## Development Workflow

1. **Setup**: Both frontend and backend run independently on different ports
2. **Database**: Run migrations and seed data before starting development
3. **Testing**: Backend has comprehensive test suite; use integration tests for API changes
4. **Payments**: Test mode Paystack keys for development; webhook testing available

## Nigerian E-commerce Considerations

- **Currency**: Prices stored in kobo (smallest NGN unit), display formatting handles conversion
- **Payment Methods**: Paystack integration supports cards, bank transfers, USSD
- **Shipping**: Zone-based shipping with Lagos express delivery options
- **Mobile-First**: Nigerian users primarily mobile, ensure responsive design

## Key Files to Understand

- `rebbie-store-backend/medusa-config.ts`: Core backend configuration
- `frontend/src/lib/medusa.ts`: API client and business logic
- `frontend/src/context/CartContext.tsx`: Cart state management
- `frontend/src/lib/types.ts`: TypeScript type definitions