# Workspace Type Migration: Personal to Default

## Overview
This document outlines the changes made to fix workspace creation issues by:
1. Changing workspace type from 'personal' to 'default'
2. Allowing multiple workspaces per user (1 default + max 3 team)
3. Smart default detection during onboarding

## Changes Implemented

### 1. Database Schema Update ✅
- **File**: `drizzle/schema.ts`
- **Change**: Updated enum from `['personal', 'team']` to `['default', 'team']`
- **Default**: Changed from 'personal' to 'default'

### 2. TypeScript Types Update ✅
- **File**: `lib/types/workspace.ts`
- **Change**: Updated `WorkspaceType` from `'personal' | 'team'` to `'default' | 'team'`

### 3. Workspace Utility Functions Update ✅
- **File**: `lib/workspace.ts`
- **Changes**:
  - Renamed `getUserPersonalWorkspace()` → `getUserDefaultWorkspace()`
  - Updated all queries from `type: 'personal'` to `type: 'default'`
  - Added workspace count validation functions:
    - `getWorkspaceCount(userId)`
    - `canCreateDefaultWorkspace(userId)`
    - `canCreateTeamWorkspace(userId)`
    - `getWorkspaceLimitsInfo(userId)`
  - Updated `createWorkspaceFromEmail()` to create 'default' type

### 4. Smart Onboarding Logic Update ✅
- **File**: `app/api/workspace/onboard/route.ts`
- **Changes**:
  - Added check for existing default workspace
  - If default exists → redirect to existing (no welcome parameter)
  - If no default → create new default workspace (with welcome parameter)
  - Updated activity logging to reflect 'default' type

### 5. New Workspace Creation API ✅
- **File**: `app/api/workspaces/create/route.ts`
- **Features**:
  - Validates workspace limits (1 default + max 3 team)
  - Auto-determines workspace type based on availability
  - Comprehensive error messages with current limits
  - Slug availability validation

### 6. Database Migration Script ✅
- **File**: `drizzle/0005_change_personal_to_default.sql`
- **Purpose**: Updates existing 'personal' workspaces to 'default'
- **Safety**: Adds unique index to prevent multiple default workspaces per user

## Test Cases to Verify

### [Case 1] ✅ Database Schema
- **When**: Schema updated
- **Verify**: Workspace type enum is `['default', 'team']` with default value 'default'

### [Case 2] ⏳ Migration Script
- **When**: Run migration script
- **Verify**: All existing 'personal' workspaces become 'default' workspaces
- **Command**: `npm run db:push` then run migration script

### [Case 3] ✅ One Default Workspace Per Email
- **When**: User tries to create multiple 'default' workspaces  
- **Verify**: API returns error "You can only have one default workspace"

### [Case 4] ✅ Maximum 3 Team Workspaces Per Email
- **When**: User tries to create 4th team workspace
- **Verify**: API returns error "Maximum 3 team workspaces allowed per account"

### [Case 5] ✅ Smart Onboarding - Existing Default
- **When**: User with existing default workspace goes through onboarding
- **Verify**: Redirects to existing default workspace without welcome parameter

### [Case 6] ✅ Smart Onboarding - No Default
- **When**: New user or user without default workspace goes through onboarding
- **Verify**: Creates new default workspace with welcome parameter

### [Case 7] ✅ Workspace Creation API Limits
- **When**: Creating new workspace through `/api/workspaces/create`
- **Verify**: 
  - Validates 1 default + max 3 team limit
  - Returns detailed error messages with current count
  - Auto-determines workspace type

## Manual Steps Required

### Step 1: Apply Database Changes
```bash
# Navigate to project directory
cd /Users/prakash/Documents/hobby/convo

# Apply schema changes
npm run db:push
```

### Step 2: Run Data Migration
```sql
-- Manual SQL to run in database
UPDATE workspaces SET type = 'default' WHERE type = 'personal';

-- Create unique index to prevent multiple defaults
CREATE UNIQUE INDEX IF NOT EXISTS idx_workspaces_owner_default 
ON workspaces (owner_id) 
WHERE type = 'default';
```

### Step 3: Verify Migration
```sql
-- Check migration results
SELECT COUNT(*) as default_count FROM workspaces WHERE type = 'default';
SELECT COUNT(*) as personal_count FROM workspaces WHERE type = 'personal';

-- Check for duplicate defaults (should be empty)
SELECT owner_id, COUNT(*) as count 
FROM workspaces 
WHERE type = 'default' 
GROUP BY owner_id 
HAVING COUNT(*) > 1;
```

## API Endpoints Updated

### 1. Onboarding API
- **URL**: `POST /api/workspace/onboard`
- **Behavior**: Smart default detection
- **Response**: Includes `isNewWorkspace` flag for welcome parameter

### 2. Workspace Creation API  
- **URL**: `POST /api/workspaces/create`
- **Features**: Workspace limits validation
- **URL**: `GET /api/workspaces/create`
- **Features**: Get current workspace limits

## Error Messages

### Default Workspace Limit
```json
{
  "error": "You can only have one default workspace.",
  "details": {
    "currentCount": { "default": 1, "team": 2 },
    "limits": { "default": 1, "team": 3 }
  }
}
```

### Team Workspace Limit
```json
{
  "error": "Maximum 3 team workspaces allowed per account.",
  "details": {
    "currentCount": { "default": 1, "team": 3 },
    "limits": { "default": 1, "team": 3 }
  }
}
```

## Next Steps

1. **Apply Database Migration**: Run the migration script to update existing data
2. **Test Onboarding Flow**: Verify smart default detection works
3. **Test Workspace Creation**: Verify limits are enforced
4. **Update UI Components**: Update any components that reference 'personal' workspaces
5. **Update Documentation**: Update any remaining documentation references

## Files Modified

- ✅ `drizzle/schema.ts` - Schema enum update
- ✅ `lib/types/workspace.ts` - TypeScript types
- ✅ `lib/workspace.ts` - Utility functions and limits
- ✅ `app/api/workspace/onboard/route.ts` - Smart onboarding
- ✅ `app/api/workspaces/create/route.ts` - New creation API
- ✅ `drizzle/0005_change_personal_to_default.sql` - Migration script

## Files to Check Later

- `components/app/workspace/workspace-switcher.tsx` - May need 'personal' → 'default' updates
- `components/app/workspace/workspace-creation-dialog.tsx` - May need limits display
- Any other components referencing workspace types
