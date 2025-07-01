# Kinton Loyalty System

## Overview

A loyalty program management system for a Japanese restaurant (Kinton) that allows customers to collect digital stamps and redeem rewards. The system features separate interfaces for customers and managers, built with a modern full-stack architecture using React, Express, and PostgreSQL.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom Japanese restaurant theme
- **Build Tool**: Vite with HMR support

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API**: RESTful endpoints with JSON responses
- **Authentication**: Bearer token-based (user ID as token for development)
- **Password Security**: bcrypt for hashing

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Connection**: Neon serverless connection pooling
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Authentication System
- Phone number and password-based authentication
- Role-based access control (CUSTOMER, MANAGER, ADMIN)
- Local storage for token persistence
- Separate login flows for customers and managers

### QR Code System
- Dynamic QR code generation for customers
- Time-based expiration (configurable)
- Manager validation interface
- QR code scanning capabilities (camera integration)

### Stamp Collection
- Digital stamp collection system
- Progress tracking (X/10 stamps)
- Automatic reward generation upon completion
- Stamp history and audit trail

### Reward Management
- Configurable reward types (free gyoza, discounts, special items)
- Automatic reward creation after collecting required stamps
- Redemption tracking and status management

### Manager Tools
- QR code validation interface
- Customer validation and stamp addition
- Real-time feedback and success animations

## Data Flow

1. **Customer Registration**: Phone + password → User creation → Auto-login
2. **QR Generation**: Customer request → Generate unique code → Return QR data
3. **Stamp Collection**: Manager scans QR → Validate code → Add stamp → Check for rewards
4. **Reward Redemption**: Customer views rewards → Manager processes redemption

## External Dependencies

### Core Dependencies
- `@neondatabase/serverless`: PostgreSQL connection
- `drizzle-orm`: Database ORM
- `bcrypt`: Password hashing
- `qrcode`: QR code generation
- `nanoid`: Unique ID generation

### UI Dependencies
- `@radix-ui/*`: Headless UI components
- `@tanstack/react-query`: Server state management
- `react-hook-form`: Form management
- `zod`: Schema validation
- `tailwindcss`: Styling framework

### Development Dependencies
- `vite`: Build tool and dev server
- `typescript`: Type checking
- `tsx`: TypeScript execution

## Deployment Strategy

### Development
- Vite dev server with HMR
- Express server with middleware logging
- Database migrations via Drizzle Kit
- Environment variables for database connection

### Production Build
- Vite builds React app to `dist/public`
- esbuild bundles Express server to `dist/index.js`
- Static file serving from Express
- NODE_ENV=production configuration

### Database Management
- Schema defined in `shared/schema.ts`
- Migrations generated in `./migrations`
- Push schema changes with `npm run db:push`
- Supports both development and production databases

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)
- Neon database integration with WebSocket support

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 01, 2025. Initial setup
- July 01, 2025. Fixed authentication issue in API requests - added Bearer token headers to queryClient.ts