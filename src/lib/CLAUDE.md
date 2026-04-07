# CLAUDE.md — Lib Module

## Purpose
This module contains shared utilities, hooks, helpers, and utility functions used across the application.

## Directory Structure

```
src/lib/
├── api/                   # API client utilities
│   ├── client.ts         # Fetch wrapper / API client
│   └── types.ts          # API response types
├── auth/                  # Authentication utilities
│   ├── jwt.ts            # JWT decode/encode
│   ├── session.ts        # Session management
│   └── guards.ts         # Auth guard functions
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts        # Auth context hook
│   ├── useQuery.ts       # Data fetching hook
│   └── ...other hooks
├── utils/                 # General utilities
│   ├── format.ts         # String formatting, dates
│   ├── validate.ts       # Form validation
│   ├── constants.ts      # App constants
│   └── errors.ts         # Error classes
├── db/                    # Database utilities (if needed)
│   ├── client.ts         # DB connection
│   └── migrations.ts     # Migration helpers
└── types/                 # Shared type definitions
    ├── user.ts
    ├── api.ts
    └── ...other types
```

## Common Utilities

### API Client

```typescript
// src/lib/api/client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new APIError(`API error: ${response.statusText}`, response.status);
  }

  return response.json();
}

// Usage in components
const data = await apiCall<User>('/api/user');
```

### Custom Hooks

```typescript
// src/lib/hooks/useAuth.ts
'use client';
import { useContext } from 'react';
import { AuthContext } from '@/components/providers/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Usage
'use client';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Dashboard() {
  const { user, logout } = useAuth();
  return <div>Welcome, {user.name}</div>;
}
```

### Type Definitions

```typescript
// src/lib/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface UserInput {
  email: string;
  name: string;
  password: string;
}
```

### Validation

```typescript
// src/lib/utils/validate.ts
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors = [];
  if (password.length < 8) errors.push('Must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Must contain uppercase');
  if (!/\d/.test(password)) errors.push('Must contain a number');
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### Error Classes

```typescript
// src/lib/utils/errors.ts
export class APIError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends Error {
  constructor(public field: string, public message: string) {
    super(`Validation error in ${field}: ${message}`);
    this.name = 'ValidationError';
  }
}

// Usage
try {
  await apiCall('/api/user');
} catch (error) {
  if (error instanceof APIError) {
    console.error(`API failed with status ${error.status}`);
  }
}
```

## Constants

```typescript
// src/lib/utils/constants.ts
export const APP_NAME = 'Your App Name';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  SETTINGS: '/dashboard/settings',
} as const;

export const API_ROUTES = {
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  USER_PROFILE: '/api/user/profile',
  USER_UPDATE: '/api/user/update',
} as const;
```

## Helper Functions

### Date Formatting

```typescript
// src/lib/utils/format.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function relativeTime(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
```

### String Utilities

```typescript
// src/lib/utils/format.ts
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
```

## Best Practices

- **Keep utilities pure:** No side effects, same input = same output
- **Type everything:** Use TypeScript for all utilities
- **Export types:** Export both functions and their types
- **Organize by domain:** Group related utilities in subdirectories
- **Test utilities:** Unit test pure functions thoroughly
- **Document complex logic:** Use comments for non-obvious implementations
- **Avoid circular dependencies:** Be careful with imports between modules

## Environment Variables

Store constants in environment files:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Your App
API_SECRET=secret_key_here
DATABASE_URL=postgresql://...
```

Access in code:

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const secret = process.env.API_SECRET; // Server-side only
```

---

For custom hooks specific to React patterns, see `src/components/CLAUDE.md`.
For API route implementations, see `src/api/CLAUDE.md`.
