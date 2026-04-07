# CLAUDE.md — Persistence Module

## Purpose
This module handles all database interactions, data models, ORM configuration, and database queries.

## Directory Structure

```
src/persistence/
├── models/                 # Data models / schemas
│   ├── user.ts
│   ├── post.ts
│   ├── comment.ts
│   └── ...other models
├── queries/                # Query functions / repositories
│   ├── userQueries.ts
│   ├── postQueries.ts
│   ├── commentQueries.ts
│   └── ...other queries
├── migrations/             # Database migrations
│   ├── 001_create_users.sql
│   ├── 002_create_posts.sql
│   └── ...other migrations
├── client.ts               # DB client initialization
└── types.ts                # Shared database types
```

## Database Client Setup

### PostgreSQL with Prisma ORM (Recommended)

```typescript
// src/persistence/client.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### PostgreSQL with Knex + custom queries

```typescript
// src/persistence/client.ts
import knex from 'knex';

export const db = knex({
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: './migrations',
  },
});
```

## Data Models

### Prisma Schema Example

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String   @map("password_hash")
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
  comments  Comment[]

  @@index([email])
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  comments  Comment[]

  @@index([userId])
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([postId])
}
```

## Query Functions (Repositories)

### User Queries

```typescript
// src/persistence/queries/userQueries.ts
import { prisma } from '../client';
import { User } from '@prisma/client';

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function getAllUsers(
  page: number = 1,
  limit: number = 10
): Promise<{ users: User[]; total: number }> {
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.user.count(),
  ]);

  return { users, total };
}

export async function createUser(
  email: string,
  name: string,
  passwordHash: string
): Promise<User> {
  return prisma.user.create({
    data: {
      email,
      name,
      password: passwordHash,
    },
  });
}

export async function updateUser(
  id: string,
  data: Partial<User>
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string): Promise<User> {
  return prisma.user.delete({
    where: { id },
  });
}
```

### Post Queries

```typescript
// src/persistence/queries/postQueries.ts
import { prisma } from '../client';

export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      comments: { include: { user: { select: { name: true } } } },
    },
  });
}

export async function getPostsByUserId(
  userId: string,
  published?: boolean
) {
  return prisma.post.findMany({
    where: {
      userId,
      ...(published !== undefined && { published }),
    },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createPost(
  userId: string,
  title: string,
  content: string,
  published: boolean = false
) {
  return prisma.post.create({
    data: { userId, title, content, published },
    include: { user: { select: { name: true } } },
  });
}

export async function updatePost(
  id: string,
  data: { title?: string; content?: string; published?: boolean }
) {
  return prisma.post.update({
    where: { id },
    data,
  });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}
```

## Transactions

```typescript
// Handle multiple operations atomically
export async function transferBetweenAccounts(
  fromUserId: string,
  toUserId: string,
  amount: number
) {
  return prisma.$transaction(async (tx) => {
    const from = await tx.user.update({
      where: { id: fromUserId },
      data: { balance: { decrement: amount } },
    });

    const to = await tx.user.update({
      where: { id: toUserId },
      data: { balance: { increment: amount } },
    });

    return { from, to };
  });
}
```

## Raw Queries (When ORM is Limiting)

```typescript
// src/persistence/queries/custom.ts
import { db } from '../client';

export async function getTopPostsByCommentCount(limit: number = 10) {
  return db.raw(`
    SELECT p.*, COUNT(c.id) as comment_count
    FROM posts p
    LEFT JOIN comments c ON p.id = c.post_id
    GROUP BY p.id
    ORDER BY comment_count DESC
    LIMIT ?
  `, [limit]);
}
```

## Migrations

### Prisma Migrations

```bash
# Create a migration
npx prisma migrate dev --name add_user_table

# Apply migrations in production
npx prisma migrate deploy

# Rollback (create a new migration reversing changes)
# Note: Prisma doesn't support rollback; create new migration instead
```

### Raw SQL Migrations

```sql
-- migrations/001_create_users.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

## Best Practices

- **Use transactions:** For multi-step operations
- **Index frequently queried columns:** email, userId, postId
- **Use prepared statements:** Prevent SQL injection
- **Validate input:** In queries or API layer
- **Handle null:** Assume queries can return null
- **Optimize queries:** Use SELECT specific columns, not *
- **Pagination:** Implement limit/offset for large datasets
- **Connection pooling:** Use for production databases

## Environment Variables

```bash
# .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

## Common Patterns

### Find and Update

```typescript
export async function findAndUpdateUser(
  email: string,
  updates: Partial<User>
) {
  const user = await getUserByEmail(email);
  if (!user) return null;
  
  return updateUser(user.id, updates);
}
```

### Bulk Operations

```typescript
export async function createMultiplePosts(
  userId: string,
  posts: Array<{ title: string; content: string }>
) {
  return prisma.post.createMany({
    data: posts.map((p) => ({ ...p, userId })),
  });
}
```

### Soft Deletes

```prisma
// Add deletedAt field
model User {
  // ... other fields
  deletedAt DateTime?
}

// Query with scope
export async function getActiveUsers() {
  return prisma.user.findMany({
    where: { deletedAt: null },
  });
}
```

---

For API route implementations using these queries, see `src/api/CLAUDE.md`.
For shared types and utilities, see `src/lib/CLAUDE.md`.
