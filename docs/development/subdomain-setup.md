# Subdomain Setup Documentation

## Overview

This Next.js application now supports multiple subdomains with distinct functionality:

- **Main Domain** (`mywebsite.com`) - Marketing and landing pages
- **App Subdomain** (`app.mywebsite.com`) - Authenticated dashboard and form creation
- **Forms Subdomain** (`forms.mywebsite.com`) - Public form filling interface

## Architecture

### Folder Structure

```
app/
├── (app)/                    # App subdomain (app.mywebsite.com)
│   ├── (auth)/              # Authentication routes
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── layout.tsx       # Auth-specific layout
│   ├── dashboard/
│   ├── forms/
│   │   └── new/
│   ├── form/                # Form builder
│   ├── layout.tsx           # App layout with sidebar/navbar
│   └── page.tsx
├── (forms)/                 # Forms subdomain (forms.mywebsite.com)
│   ├── layout.tsx           # Minimal public layout
│   └── page.tsx
├── (marketing)/             # Main domain (mywebsite.com)
│   ├── layout.tsx           # Marketing layout
│   └── page.tsx
├── api/                     # Shared API routes
├── globals.css
├── layout.tsx               # Root layout
└── page.tsx                 # Root redirect
```

### Components Structure

```
components/
├── app/                     # App subdomain components
│   ├── navbar.tsx           # App navigation bar
│   └── sidebar.tsx          # App sidebar
├── ui/                      # Shared UI components
│   └── header.tsx           # Marketing header
└── theme/                   # Theme provider
```

## Subdomain Routing

### Middleware Implementation

The middleware (`middleware.ts`) handles subdomain detection and routing:

1. **Development Mode**: Uses query parameters (`?subdomain=app`)
2. **Production Mode**: Detects subdomain from hostname
3. **Rewrites**: Maps subdomains to corresponding route groups

### Route Mapping

- `app.mywebsite.com` → `/(app)/*`
- `forms.mywebsite.com` → `/(forms)/*`
- `mywebsite.com` → `/(marketing)/*`

## Authentication Flow

### App Subdomain Only
- Sign-in/Sign-up routes: `app.mywebsite.com/sign-in`, `app.mywebsite.com/sign-up`
- Protected routes require authentication
- Redirects unauthenticated users to sign-in

### Public Routes
- Forms subdomain is completely public
- Marketing site is public
- API webhooks remain accessible

## Development Setup

### Local Testing

#### Option 1: Query Parameters (Easiest)
```bash
# App subdomain
http://localhost:3002?subdomain=app

# Forms subdomain  
http://localhost:3002?subdomain=forms

# Marketing (default)
http://localhost:3002
```

#### Option 2: Local Domains
Add to `/etc/hosts`:
```
127.0.0.1 app.localhost
127.0.0.1 forms.localhost
127.0.0.1 localhost
```

Access via:
- `http://app.localhost:3002`
- `http://forms.localhost:3002`
- `http://localhost:3002`

## Production Deployment

### DNS Configuration
Set up DNS records pointing to your server:
```
A    mywebsite.com        → YOUR_SERVER_IP
A    app.mywebsite.com    → YOUR_SERVER_IP  
A    forms.mywebsite.com  → YOUR_SERVER_IP
```

### Environment Variables
Update your environment variables to reflect the subdomain structure:
```env
NEXT_PUBLIC_APP_URL=https://app.mywebsite.com
NEXT_PUBLIC_FORMS_URL=https://forms.mywebsite.com
NEXT_PUBLIC_MARKETING_URL=https://mywebsite.com
```

## Key Features

### App Subdomain (`app.mywebsite.com`)
- **Full Authentication**: Powered by Clerk
- **Dashboard**: User dashboard with form management
- **Form Builder**: Drag-and-drop form creation
- **Form Creation**: AI-powered form generation
- **Sidebar Navigation**: Rich navigation experience
- **User Management**: Profile, settings, team management

### Forms Subdomain (`forms.mywebsite.com`)
- **Public Access**: No authentication required
- **Form Filling**: Clean, minimal interface for form completion
- **Conversational Mode**: Engage users with conversational forms
- **Landing Page**: Information about the forms platform

### Marketing Site (`mywebsite.com`)
- **Landing Page**: Product information and features
- **Public Marketing**: No authentication required
- **Sign-up CTAs**: Direct users to app subdomain for registration

## Security Considerations

1. **Authentication Isolation**: Auth only on app subdomain
2. **CORS Configuration**: Proper cross-origin handling
3. **Cookie Domains**: Configured for subdomain sharing where needed
4. **CSP Headers**: Content Security Policy for each subdomain

## Maintenance

### Adding New Routes
1. **App Subdomain**: Add to `app/(app)/`
2. **Forms Subdomain**: Add to `app/(forms)/`
3. **Marketing**: Add to `app/(marketing)/`

### Updating Middleware
Modify `middleware.ts` for new subdomain patterns or routing rules.

### Cross-Subdomain Links
Use full URLs when linking between subdomains:
```tsx
<Link href="https://app.mywebsite.com/dashboard">Dashboard</Link>
<Link href="https://forms.mywebsite.com">Forms</Link>
```

## Troubleshooting

### Common Issues

1. **Subdomain not working locally**
   - Check hosts file configuration
   - Use query parameter method instead

2. **Authentication not working**
   - Verify Clerk configuration for subdomain
   - Check middleware auth route handling

3. **Routing issues**
   - Verify middleware rewrite rules
   - Check route group naming conventions

### Debugging

Enable middleware logging in development:
```typescript
console.log('Subdomain:', subdomain);
console.log('Original path:', url.pathname);
console.log('Rewritten path:', newPath);
```

## Performance Considerations

- **Shared Components**: UI components shared across subdomains
- **Code Splitting**: Automatic splitting by route groups
- **Static Assets**: Served from root domain
- **API Routes**: Shared across all subdomains