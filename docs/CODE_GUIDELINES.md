# Code Guidelines - NO MERCY MODE 🔥

## Overview

This project enforces **AGGRESSIVE** code quality standards with **NO MERCY** for unused code, poor TypeScript practices, or sloppy imports. Every commit is ruthlessly checked and will be **REJECTED** if it doesn't meet our standards.

## 🚫 What Will BLOCK Your Commits

### 1. **Unused Imports & Variables** ❌
```typescript
// ❌ BLOCKED - Unused import
import { useState, useEffect } from 'react'; // useEffect not used

// ❌ BLOCKED - Unused variable
const data = fetchData(); // data not used

// ✅ ALLOWED - Prefixed with underscore
const _debugVar = 'kept for debugging';
```

### 2. **TypeScript `any` Types** ❌
```typescript
// ❌ BLOCKED - any type
const data: any = response.json();

// ✅ ALLOWED - Proper typing
const data: ApiResponse = response.json();
const data: unknown = response.json(); // If type is truly unknown
```

### 3. **Unused Dependencies** ❌
```json
// ❌ BLOCKED - Package in package.json but not imported anywhere
{
  "dependencies": {
    "lodash": "^4.17.21"  // Not used in any file
  }
}
```

### 4. **Dead Code Exports** ❌
```typescript
// ❌ BLOCKED - Exported but never imported
export const unusedFunction = () => {}; // No imports found

// ✅ ALLOWED - Actually used
export const usedFunction = () => {};
```

### 5. **Default Exports** ❌ (Preferred: Named Exports)
```typescript
// ❌ BLOCKED - Default export (except in specific files)
export default function MyComponent() {}

// ✅ ALLOWED - Named export
export function MyComponent() {}
```

### 6. **Any Lint Warnings** ❌
```typescript
// ❌ BLOCKED - Any ESLint warnings
console.log('debug'); // no-console warning

// ✅ ALLOWED - Explicit disable or proper logging
// eslint-disable-next-line no-console
console.log('intentional debug');
```

## 🛠️ Development Workflow

### Before Committing
```bash
# Check everything locally first
npm run lint:full

# Individual checks
npm run lint                # ESLint + TypeScript
npm run lint:unused-deps    # Unused dependencies
npm run lint:dead-code      # Dead code detection
npm run bundle-analyze      # Bundle size analysis
```

### Commit Process
```bash
# 1. Stage your changes
git add .

# 2. Commit (will trigger aggressive checks)
git commit -m "Your commit message"

# 3. If blocked, fix issues and try again
npm run lint:full  # See what's wrong
# Fix issues...
git commit -m "Fixed issues"
```

## 📋 Specific Rules

### ESLint Configuration
```javascript
{
  // AGGRESSIVE: No unused imports/variables
  "unused-imports/no-unused-imports": "error",
  "unused-imports/no-unused-vars": "error",
  
  // AGGRESSIVE: No any types
  "@typescript-eslint/no-explicit-any": "error",
  
  // AGGRESSIVE: Prefer named exports
  "import/no-default-export": "error",
  
  // AGGRESSIVE: No unused modules
  "import/no-unused-modules": "error"
}
```

### File-Specific Rules
```javascript
// Next.js files (default exports allowed)
- app/**/page.tsx
- app/**/layout.tsx
- app/manifest.ts
- app/robots.ts
- app/sitemap.ts
- middleware.ts
- *.config.ts
- *.config.js

// Test files (any types allowed)
- **/*.test.ts
- **/*.spec.ts
- **/__tests__/**/*
```

## 🔄 Pre-commit Hook Details

### What Runs on Every Commit
```json
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix --max-warnings=0",  // Fix + no warnings
    "prettier --write"                // Format
  ],
  "*.{css,scss,sass}": [
    "stylelint --fix --max-warnings=0", // Fix + no warnings
    "prettier --write"
  ],
  "package.json": [
    "depcheck --config=.depcheckrc.json" // Check unused deps
  ],
  "tsconfig.json": [
    "ts-prune --error"  // Check dead code
  ]
}
```

### Timing
- **ESLint**: 2-5 seconds
- **Depcheck**: 1-2 seconds
- **ts-prune**: 1-2 seconds
- **Total**: 5-10 seconds per commit

## 🛡️ Escape Hatches (Use Sparingly)

### 1. Intentional Unused Variables
```typescript
// Prefix with underscore
const _debugVar = 'kept for debugging';
const _unusedParam = 'parameter required by interface';

// In function parameters
function handleClick(_event: MouseEvent) {
  // event not used but required by interface
}
```

### 2. Unavoidable Any Types
```typescript
// External library with poor types
const data: any = externalLib.getData(); // eslint-disable-line @typescript-eslint/no-explicit-any

// Better: Use unknown and type guards
const data: unknown = externalLib.getData();
if (typeof data === 'object' && data !== null) {
  // Use data with type checking
}
```

### 3. Emergency Bypass (DO NOT ABUSE)
```bash
# Only for emergencies (hotfixes, urgent deployments)
git commit --no-verify -m "Emergency: Fix critical production issue"
```

## 📊 Monitoring & Metrics

### Available Analysis Commands
```bash
# Bundle size analysis
npm run bundle-analyze

# Unused dependencies report
npm run lint:unused-deps

# Dead code report
npm run lint:dead-code

# Full lint report
npm run lint:full
```

### Expected Metrics
- **Bundle size reduction**: 10-30%
- **Build time improvement**: 5-15%
- **Code maintainability**: Significantly improved
- **Developer experience**: Better IntelliSense, fewer runtime errors

## 🎯 Best Practices

### 1. Import Organization
```typescript
// ✅ GOOD - Organized imports
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useAuth } from '@/hooks/useAuth';
import { ApiService } from '@/lib/api';

// ❌ BAD - Disorganized imports
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ApiService } from '@/lib/api';
```

### 2. Type Safety
```typescript
// ✅ GOOD - Proper typing
interface ApiResponse<T> {
  data: T;
  message: string;
}

const fetchUser = async (): Promise<ApiResponse<User>> => {
  const response = await fetch('/api/user');
  return response.json();
};

// ❌ BAD - Any types
const fetchUser = async (): Promise<any> => {
  const response = await fetch('/api/user');
  return response.json();
};
```

### 3. Export Patterns
```typescript
// ✅ GOOD - Named exports
export const UserService = {
  getUser: () => {},
  updateUser: () => {}
};

export const validateEmail = (email: string) => {};

// ❌ BAD - Default export (except in allowed files)
export default class UserService {
  getUser() {}
  updateUser() {}
}
```

### 4. Error Handling
```typescript
// ✅ GOOD - Proper error typing
try {
  const data = await apiCall();
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
  }
}

// ❌ BAD - Any error type
try {
  const data = await apiCall();
} catch (error: any) {
  console.error('API Error:', error.message);
}
```

## 🚨 Common Issues & Solutions

### Issue 1: "Unused variable" error
```typescript
// Problem
const data = fetchData(); // Not used

// Solution 1: Use the variable
const data = fetchData();
processData(data);

// Solution 2: Remove if not needed
// const data = fetchData(); // Remove line

// Solution 3: Mark as intentional
const _data = fetchData(); // Underscore prefix
```

### Issue 2: "No explicit any" error
```typescript
// Problem
const response: any = await fetch('/api');

// Solution 1: Proper typing
interface ApiResponse {
  data: User[];
  message: string;
}
const response: ApiResponse = await fetch('/api').then(r => r.json());

// Solution 2: Unknown type
const response: unknown = await fetch('/api').then(r => r.json());
```

### Issue 3: "Prefer named exports" error
```typescript
// Problem
export default function MyComponent() {}

// Solution 1: Named export
export function MyComponent() {}

// Solution 2: If in allowed file (pages, etc.)
// Default exports are allowed in Next.js pages
```

### Issue 4: "Unused dependency" error
```bash
# Problem: Package in package.json but not imported

# Solution 1: Remove from package.json
npm uninstall unused-package

# Solution 2: Add to depcheck ignore list (if needed for build)
# Edit .depcheckrc.json -> "ignoreMatches": ["build-only-package"]
```

## 🔧 Configuration Files

### `.eslintrc.json`
Contains aggressive ESLint rules for unused code detection.

### `.depcheckrc.json`
Configuration for dependency checking with ignored packages.

### `.lintstagedrc.json`
Pre-commit hook configuration with aggressive settings.

### `package.json`
Scripts for running various unused code detection tools.

## 📈 Migration Guide

### For Existing Code
1. Run `npm run lint:full` to see all issues
2. Fix issues in batches:
   ```bash
   # Fix unused imports
   npm run lint:fix
   
   # Fix any types
   # Manual fixes required
   
   # Remove unused dependencies
   npm run lint:unused-deps
   ```

### For New Features
1. Write code with proper types from the start
2. Use named exports by default
3. Clean up unused imports before committing
4. Test with `npm run lint:full` before committing

## 🎓 Learning Resources

### TypeScript Best Practices
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### ESLint Rules
- [ESLint Rules Documentation](https://eslint.org/docs/rules/)
- [TypeScript ESLint Rules](https://typescript-eslint.io/rules/)

### Import/Export Patterns
- [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [ES6 Import/Export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)

## 🤝 Team Guidelines

### Code Review Checklist
- [ ] No unused imports or variables
- [ ] No `any` types (use proper typing)
- [ ] Named exports used (except in allowed files)
- [ ] All dependencies are used
- [ ] No dead code exports
- [ ] ESLint passes with no warnings

### Onboarding New Developers
1. Read this document thoroughly
2. Set up development environment
3. Run `npm run lint:full` on first commit
4. Understand escape hatches but use sparingly
5. Ask questions about typing instead of using `any`

## 🚀 Benefits

### For Developers
- **Cleaner code**: No unused imports cluttering files
- **Better IntelliSense**: Proper types improve IDE experience
- **Faster debugging**: Type safety catches errors early
- **Learning**: Forces better TypeScript practices

### For Project
- **Smaller bundles**: Unused code automatically removed
- **Better performance**: Optimized imports and dependencies
- **Maintainability**: Clean, well-typed codebase
- **Documentation**: Types serve as inline documentation

## 🎯 Summary

This project enforces **AGGRESSIVE** code quality standards. Every commit is checked for:

- ✅ No unused imports/variables
- ✅ No `any` types  
- ✅ No unused dependencies
- ✅ No dead code
- ✅ Proper export patterns
- ✅ Zero lint warnings

**Your commits will be REJECTED if they don't meet these standards.**

This may seem strict, but it results in a **cleaner, faster, more maintainable codebase** that the entire team benefits from.

**Welcome to NO MERCY MODE!** 🔥

---

*Generated with [Claude Code](https://claude.ai/code) - Aggressive Code Quality Enforcement*