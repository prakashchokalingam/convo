# Quick Reference - Aggressive Code Quality 🔥

## 🚨 COMMIT BLOCKED? Quick Fixes

### Unused Import/Variable
```bash
# Error: 'useState' is defined but never used
import { useState, useEffect } from 'react'; // useState not used

# Fix: Remove unused import
import { useEffect } from 'react';

# Or: Use underscore prefix if intentional
const _debugVar = 'kept for debugging';
```

### TypeScript `any` Type
```bash
# Error: Unexpected any. Specify a different type.
const data: any = response.json();

# Fix: Use proper type
const data: ApiResponse = response.json();

# Or: Use unknown if type is truly unknown
const data: unknown = response.json();
```

### Default Export Error
```bash
# Error: Prefer named exports
export default function MyComponent() {}

# Fix: Use named export
export function MyComponent() {}
```

### Unused Dependency
```bash
# Error: 'lodash' is listed in dependencies but never used

# Fix: Remove from package.json
npm uninstall lodash
```

## 🛠️ Quick Commands

```bash
# Check everything
npm run lint:full

# Fix auto-fixable issues
npm run lint:fix

# Check specific issues
npm run lint:unused-deps     # Unused dependencies
npm run lint:dead-code      # Dead code exports
npm run bundle-analyze      # Bundle size

# Emergency bypass (don't abuse!)
git commit --no-verify -m "Emergency fix"
```

## 📋 Escape Hatches

### Intentional Unused Variables
```typescript
const _debugVar = 'kept for debugging';
const _unusedParam = 'required by interface';

function handleClick(_event: MouseEvent) {
  // event not used but required
}
```

### Unavoidable Any Types
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = externalLib.getData();

// Better: Use unknown
const data: unknown = externalLib.getData();
```

### Files Allowed Default Exports
- `app/**/page.tsx`
- `app/**/layout.tsx`
- `app/manifest.ts`
- `app/robots.ts`
- `app/sitemap.ts`
- `middleware.ts`
- `*.config.ts`
- `*.config.js`

## 🎯 Best Practices

### Good Import Pattern
```typescript
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useAuth } from '@/hooks/useAuth';
```

### Good Type Pattern
```typescript
interface ApiResponse<T> {
  data: T;
  message: string;
}

const fetchUser = async (): Promise<ApiResponse<User>> => {
  const response = await fetch('/api/user');
  return response.json();
};
```

### Good Export Pattern
```typescript
export const UserService = {
  getUser: () => {},
  updateUser: () => {}
};

export const validateEmail = (email: string) => {};
```

## 🔄 Pre-commit Process

1. **Stage files**: `git add .`
2. **Commit**: `git commit -m "message"`
3. **Pre-commit runs**:
   - ESLint with --max-warnings=0
   - Prettier formatting
   - Depcheck on package.json
   - ts-prune on tsconfig.json
4. **If blocked**: Fix issues and try again
5. **If passed**: Commit succeeds

## 📊 What Gets Checked

| File Type | Checks Applied |
|-----------|---------------|
| `*.{js,jsx,ts,tsx}` | ESLint (unused imports, any types, etc.) |
| `*.{css,scss,sass}` | Stylelint (unused CSS) |
| `package.json` | Depcheck (unused dependencies) |
| `tsconfig.json` | ts-prune (dead code exports) |

## 🚀 Benefits

- **Smaller bundles** (10-30% reduction)
- **Better performance** (5-15% faster builds)
- **Cleaner code** (no unused imports)
- **Type safety** (no any types)
- **Better IntelliSense** (proper typing)

## 🎯 Remember

**This is NO MERCY MODE!** 🔥

Every commit is ruthlessly checked. Fix the issues, don't try to bypass them. Your future self (and your team) will thank you for the clean, optimized codebase!

---

*Need help? Check the full [CODE_GUIDELINES.md](./CODE_GUIDELINES.md) for detailed information.*