# CLAUDE.md — App Router Module

## Purpose
This module contains the Next.js App Router structure: pages, layouts, route groups, and application-level routing.

## Structure

```
src/app/
├── layout.tsx              # Root layout (metadata, providers)
├── page.tsx                # Home page
├── (auth)/                 # Auth route group
│   ├── login/
│   ├── signup/
│   └── forgot-password/
├── (dashboard)/            # Protected dashboard route group
│   ├── layout.tsx         # Dashboard layout with sidebar
│   ├── page.tsx           # Dashboard home
│   ├── profile/
│   ├── settings/
│   └── [id]/              # Dynamic routes
├── error.tsx              # Error boundary
├── not-found.tsx          # 404 page
└── globals.css            # Global styles
```

## Key Patterns

### Root Layout
```tsx
// src/app/layout.tsx
export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'App description',
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers> {/* Auth, Theme, Query Providers */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### Route Groups
Use parentheses to group related routes without affecting URL structure:
- `(auth)` — Login, signup, password reset pages
- `(dashboard)` — Protected pages requiring authentication
- `(public)` — Public informational pages

### Server vs Client Components
- **Server components (default):** Data fetching, sensitive logic
- **Client components:** Interactivity, hooks, browser APIs
  - Use `'use client'` directive at top of file

### Dynamic Routes
```tsx
// src/app/(dashboard)/[id]/page.tsx
export default function DetailPage({ params }: { params: { id: string } }) {
  // params.id is the dynamic segment
}
```

## Data Fetching

### Server Components (Recommended)
```tsx
async function getData() {
  const res = await fetch('http://localhost:3000/api/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{JSON.stringify(data)}</div>;
}
```

### Client Components with Query
```tsx
'use client';
import { useQuery } from '@tanstack/react-query';

export default function Page() {
  const { data } = useQuery(['data'], () => fetch('/api/data').then(r => r.json()));
  return <div>{JSON.stringify(data)}</div>;
}
```

## Middleware

For authentication and request processing:

```tsx
// src/middleware.ts (at root of src/)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check auth token, redirect if needed
  const token = request.cookies.get('auth-token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Best Practices

- **Prefer server components** for data fetching and sensitive logic
- **Use route groups** to organize related pages without URL impact
- **Implement proper error handling** with error.tsx boundaries
- **Optimize images** with Next.js Image component
- **Use dynamic imports** for code splitting: `dynamic(() => import('./Component'))`
- **Cache strategies:** Use `revalidate` for ISR, `cache: 'no-store'` for dynamic data

## Metadata & SEO

```tsx
// Static metadata
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.id);
  return {
    title: post.title,
    description: post.excerpt,
  };
}
```

## Authentication

Protected routes should check auth in:
1. **Middleware** — Early request blocking
2. **Server component** — Check and render appropriately
3. **Client component** — Redirect with `useRouter().push('/login')`

See `src/api/` for auth route implementations.

## Common Gotchas

- **Serialization:** Data passed to client components must be serializable (no dates as objects)
- **Hydration mismatch:** Don't read environment variables on client without exposing them
- **Caching:** ISR may serve stale data; cache headers affect browser caching
- **Dynamic routes with params:** Always validate params before using

---

For shared components, see `src/components/CLAUDE.md`.
For API routes, see `src/api/CLAUDE.md`.
