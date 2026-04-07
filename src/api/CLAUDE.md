# CLAUDE.md — API Module

## Purpose
This module contains all server-side API routes using Next.js App Router API routes (route handlers).

## Directory Structure

```
src/app/api/
├── auth/
│   ├── login/
│   │   └── route.ts           # POST /api/auth/login
│   ├── logout/
│   │   └── route.ts           # POST /api/auth/logout
│   ├── signup/
│   │   └── route.ts           # POST /api/auth/signup
│   └── refresh/
│       └── route.ts           # POST /api/auth/refresh
├── user/
│   ├── route.ts               # GET /api/user (current user)
│   ├── profile/
│   │   └── route.ts           # GET /api/user/profile
│   └── [id]/
│       └── route.ts           # GET /api/user/:id
├── posts/
│   ├── route.ts               # GET /api/posts, POST /api/posts
│   └── [id]/
│       └── route.ts           # GET /api/posts/:id, PUT, DELETE
└── health/
    └── route.ts               # GET /api/health
```

## Route Handler Pattern

```typescript
// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const posts = await fetchPosts(); // From src/persistence/
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const post = await createPost(data);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
```

## Dynamic Routes

```typescript
// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await getPost(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const post = await updatePost(params.id, data);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deletePost(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
```

## Authentication

```typescript
// src/app/api/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function verifyAuth(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return { error: 'Unauthorized', status: 401 };
  }

  try {
    const decoded = verifyToken(token);
    return { user: decoded };
  } catch {
    return { error: 'Invalid token', status: 403 };
  }
}

// Usage in route handler
export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  
  if (auth.error) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status }
    );
  }

  // auth.user is verified
  const user = auth.user;
  return NextResponse.json({ user });
}
```

## Error Handling

```typescript
// src/app/api/utils/response.ts
import { NextResponse } from 'next/server';

export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function apiCreated<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

// Usage
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await createItem(data);
    return apiCreated(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiError(error.message, 400);
    }
    return apiError('Internal server error', 500);
  }
}
```

## Input Validation

```typescript
// src/app/api/posts/route.ts
import { z } from 'zod';

const PostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(10),
  published: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const validData = PostSchema.parse(data);
    
    const post = await createPost(validData);
    return apiCreated(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(
        `Validation error: ${error.errors[0].message}`,
        400
      );
    }
    return apiError('Internal server error', 500);
  }
}
```

## Response Formats

### Success Response
```json
{
  "data": { /* resource */ },
  "success": true
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400
}
```

### Pagination Response
```json
{
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "hasMore": true
  }
}
```

## Middleware & CORS

```typescript
// src/middleware.ts (at project root)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Add CORS headers
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Check authentication for protected routes
  if (request.nextUrl.pathname.startsWith('/api/user')) {
    const token = request.headers.get('authorization');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
```

## Rate Limiting

```typescript
// src/app/api/utils/rateLimit.ts
const requestCounts = new Map<string, { count: number; reset: number }>();

export function checkRateLimit(ip: string, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.reset) {
    requestCounts.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }

  record.count++;
  if (record.count > maxRequests) {
    return false;
  }
  return true;
}

// Usage in route handler
export async function GET(request: NextRequest) {
  const ip = request.ip || 'unknown';
  
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  // Handle request
}
```

## Best Practices

- **Use TypeScript:** Define request/response types
- **Validate input:** Use Zod or similar validation library
- **Handle errors:** Return meaningful error messages and status codes
- **Authenticate:** Check auth for protected routes
- **Log requests:** Track API activity for debugging
- **Document endpoints:** Document parameters, auth, responses
- **Use correct HTTP methods:** GET, POST, PUT, DELETE, PATCH
- **Return proper status codes:** 200, 201, 400, 401, 404, 500, etc.

## Common HTTP Status Codes

- **200** — OK (successful GET, PUT, DELETE)
- **201** — Created (successful POST creating a resource)
- **204** — No Content (successful DELETE)
- **400** — Bad Request (validation error)
- **401** — Unauthorized (missing/invalid auth)
- **403** — Forbidden (auth valid but not allowed)
- **404** — Not Found (resource doesn't exist)
- **409** — Conflict (duplicate resource, constraint violation)
- **500** — Internal Server Error (unexpected error)
- **429** — Too Many Requests (rate limit exceeded)

---

For data persistence, see `src/persistence/CLAUDE.md`.
For shared utilities and types, see `src/lib/CLAUDE.md`.
