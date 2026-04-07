# CLAUDE.md — Project Brain

## Overview
A modular, AI-driven Taxi booking platform built with Next.js/React. Users can book rides, track drivers, and manage trip history. Design from Stitch.

## Stack
- **Frontend:** React 18+, Next.js 14+ (App Router) — Stitch design system
- **Styling:** Tailwind CSS (matching Stitch design)
- **Backend:** Next.js API Routes (`src/api/`)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT tokens + session management
- **Real-time:** WebSocket for driver tracking
- **Deployment:** Vercel (or self-hosted)

## Module Map
Each module has its own CLAUDE.md for context-specific instructions:

- **src/app/** — Next.js App Router (pages, layouts, route groups)
- **src/components/** — Reusable UI components
- **src/lib/** — Utility functions and helpers
- **src/api/** — API route handlers (backend logic)
- **src/persistence/** — Database models, ORM, queries

## Key Conventions

### File Structure
- Pages live in `src/app/` following App Router conventions
- Components are in `src/components/` with `.tsx` extensions
- Utilities and helpers in `src/lib/` (grouped by domain)
- API routes in `src/app/api/` follow Next.js routing

### Code Style
- TypeScript everywhere (strict mode)
- Functional components with hooks
- Props interfaces over prop spreading
- Meaningful error messages and logging

### Naming
- Components: PascalCase (`UserProfile.tsx`)
- Functions/utilities: camelCase (`formatDate.ts`)
- Constants: UPPER_SNAKE_CASE
- Directories: kebab-case (`auth-provider/`)

## Guardrails
- All commits require descriptive messages (no "fix" or "update")
- Tests must accompany new features (see .claude/hooks/)
- API changes documented in `/docs/decisions/`

## Getting Started
1. Install dependencies: `npm install`
2. Set up environment: Copy `.env.example` to `.env.local`
3. Run dev server: `npm run dev`
4. Check `/docs/architecture.md` for system design

## Skills
Reusable AI workflows in `.claude/skills/`:
- `code-review/` — PR review checklist
- `refactor/` — Refactoring workflow
- `release/` — Next.js deployment procedure

## Questions?
Refer to module-specific CLAUDE.md files when working in that area.
