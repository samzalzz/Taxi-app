# CLAUDE.md — Components Module

## Purpose
This module contains all reusable React components for the application UI.

## Directory Structure

```
src/components/
├── ui/                    # Base UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   └── ...other primitives
├── layout/                # Layout-specific components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
├── features/              # Feature-specific components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── LogoutButton.tsx
│   ├── dashboard/
│   │   ├── Stats.tsx
│   │   ├── Chart.tsx
│   │   └── UserProfile.tsx
│   └── ...other features
└── common/                # Shared utility components
    ├── Loading.tsx
    ├── Error.tsx
    ├── Empty.tsx
    └── ...other utilities
```

## Component Patterns

### Functional Components with TypeScript

```tsx
// src/components/ui/Button.tsx
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}
```

### Server vs Client Components

**Server Component** (default, no 'use client'):
- Used for layout components that don't need interactivity
- Can fetch data directly
- Reduces JavaScript sent to browser

**Client Component** (with 'use client'):
- Required for interactivity (onClick, forms, hooks)
- Use at the leaf level, not the root
- Keep as small as possible

```tsx
// Server component (src/components/layout/Header.tsx)
import Navigation from './Navigation'; // Client component

export default function Header() {
  return (
    <header>
      <Navigation />
    </header>
  );
}

// Client component (src/components/layout/Navigation.tsx)
'use client';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Menu</button>
      {isOpen && <menu>...</menu>}
    </nav>
  );
}
```

## Props Interface Pattern

Always define props with interfaces for better type safety:

```tsx
interface CardProps {
  title: string;
  description?: string;
  children: ReactNode;
  isLoading?: boolean;
  onClose?: () => void;
}

export default function Card({
  title,
  description,
  children,
  isLoading = false,
  onClose,
}: CardProps) {
  // implementation
}
```

## Component Composition

Prefer composition over prop spreading:

```tsx
// ❌ Bad: Too many props
<UserCard user={user} showEmail showPhone showAddress showBio />

// ✅ Good: Composition
<UserCard user={user}>
  <UserEmail email={user.email} />
  <UserPhone phone={user.phone} />
  <UserAddress address={user.address} />
</UserCard>
```

## Styling Approach

### CSS Modules (Recommended)
```tsx
// src/components/ui/Button.tsx
import styles from './Button.module.css';

export default function Button({ children }) {
  return <button className={styles.button}>{children}</button>;
}
```

### Tailwind CSS
```tsx
export default function Button({ children, variant = 'primary' }) {
  return (
    <button className={`px-4 py-2 rounded ${variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}`}>
      {children}
    </button>
  );
}
```

### Theme Support
If using CSS-in-JS or theme context:

```tsx
'use client';
import { useTheme } from './ThemeContext';

export default function ThemedCard() {
  const { isDark } = useTheme();
  return <div className={isDark ? 'dark' : 'light'}>...</div>;
}
```

## Hooks Usage

```tsx
'use client';
import { useState, useCallback, useMemo } from 'react';

export default function SearchResults() {
  const [query, setQuery] = useState('');
  
  const results = useMemo(() => {
    // Only recalculate if query changes
    return filterResults(query);
  }, [query]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
  }, []);

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      <Results data={results} />
    </div>
  );
}
```

## Error Boundaries (Class Components)

For error handling across subtrees:

```tsx
// src/components/common/ErrorBoundary.tsx
'use client';
import { ReactNode, Component, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

## Naming Conventions

- Component files: **PascalCase** (e.g., `UserProfile.tsx`)
- Directories: **kebab-case** (e.g., `user-profile/`)
- Props interfaces: **ComponentNameProps** (e.g., `UserProfileProps`)

## Performance Tips

- **Memoize expensive components:** `React.memo(Component)`
- **Code split large components:** Use `dynamic(() => import(...))`
- **Lazy load on demand:** Load modals, drawers on first use
- **Optimize re-renders:** Use `useMemo`, `useCallback` judiciously
- **Image optimization:** Always use Next.js `Image` component

## Testing

Components should be testable:

```tsx
// Good: Accepts props, doesn't fetch data directly
export default function UserCard({ user }) {
  return <div>{user.name}</div>;
}

// Avoid: Fetches data internally, harder to test
export default function UserCard() {
  const { data } = useQuery(...);
}
```

---

For page layouts, see `src/app/CLAUDE.md`.
For shared utilities and hooks, see `src/lib/CLAUDE.md`.
