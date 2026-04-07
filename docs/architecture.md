# Architecture Documentation

## System Overview

This is a modern Next.js/React SaaS application with the following layers:

```
┌─────────────────────────────────────┐
│     React Frontend (src/app/)       │
│  - Pages, layouts, route groups     │
├─────────────────────────────────────┤
│    UI Components (src/components/)  │
│  - Reusable React components        │
├─────────────────────────────────────┤
│   Next.js API Routes (src/api/)     │
│  - Server-side logic, middleware    │
├─────────────────────────────────────┤
│  Persistence Layer (src/persistence/)│
│  - Database models, queries, ORM    │
├─────────────────────────────────────┤
│   External Services (DB, Auth, etc) │
└─────────────────────────────────────┘
```

## Frontend Architecture

### Next.js App Router Structure
- **src/app/** — Pages and layouts using File-based routing
- **src/app/layout.tsx** — Root layout (metadata, providers)
- **src/app/(auth)/** — Route group for authentication pages
- **src/app/(dashboard)/** — Route group for protected pages

### State Management
- **React Context** — For global UI state (theme, user)
- **TanStack Query** — For server state (API data caching)
- **Zustand/Redux** (optional) — For complex client state

### Component Organization
```
src/components/
├── ui/              # Base UI components (Button, Card, etc)
├── layout/          # Layout components (Header, Sidebar)
├── features/        # Feature-specific components
└── common/          # Shared components across features
```

## Backend Architecture

### API Routes
- **src/app/api/[resource]/route.ts** — RESTful endpoints
- Middleware for auth, validation, logging
- Error handling and response formatting

### Data Access Layer
- **src/persistence/models/** — Database schemas/models
- **src/persistence/queries/** — Typed query builders
- **src/persistence/migrations/** — Database migrations

## Key Decision Points

### Technology Choices
- **Framework:** Next.js 14+ for full-stack capability
- **Language:** TypeScript for type safety
- **Database:** (To be selected based on requirements)
- **Authentication:** (To be selected based on requirements)

### Design Patterns
- Component composition over inheritance
- Server components for data fetching (Next.js 13+)
- API routes for backend logic separation
- Separation of concerns (UI/logic/data)

## Deployment

### Target Environment
- **Primary:** Vercel (serverless functions)
- **Alternative:** Self-hosted (Docker/Node.js)

### Environment Variables
- `.env.local` — Local development
- `.env.staging` — Staging deployment
- `.env.production` — Production deployment

See `docs/runbooks/deployment.md` for detailed procedures.

## Security Considerations

- CORS policies configured in API routes
- Authentication middleware for protected routes
- Input validation and sanitization
- Rate limiting on API endpoints
- HTTPS enforced in production

## Performance Optimization

- Image optimization via Next.js Image component
- Code splitting and lazy loading
- API response caching with TanStack Query
- Database query optimization with indexes
- Static generation (SSG) where applicable

## Monitoring & Observability

- Logging via (to be configured)
- Error tracking via (to be configured)
- Performance monitoring via (to be configured)
- Analytics via (to be configured)

## Adding New Features

1. Define domain models in `src/persistence/`
2. Create API routes in `src/app/api/`
3. Build UI components in `src/components/`
4. Add pages in `src/app/`
5. Document decisions in `docs/decisions/`

---

For module-specific details, see the CLAUDE.md file in each `src/*/` directory.
