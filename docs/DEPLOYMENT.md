# 🚀 Deployment Guide

This guide covers deploying ConvoForms to production.

## 🎯 Deployment Overview

ConvoForms is designed to deploy easily on modern platforms:

```
Frontend + API: Vercel (recommended)
Database: Supabase (recommended)
Authentication: Clerk (already configured)
AI: Google Gemini (already configured)
```

## ☁️ Recommended Setup: Vercel + Supabase

### 1. Database Setup (Supabase)

**Create Supabase Project:**

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for provisioning (2-3 minutes)
4. Go to Settings → Database
5. Copy the connection string

**Configure Database:**

```bash
# Update your .env.local with Supabase URL
DATABASE_URL="postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres"

# Push your schema to Supabase
npm run db:push
```

### 2. Frontend Deployment (Vercel)

**Deploy to Vercel:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project directory
vercel

# Follow prompts:
# - Connect to your GitHub repo
# - Set project name
# - Configure build settings
```

**Environment Variables in Vercel:**
Go to your Vercel dashboard → Project → Settings → Environment Variables:

```bash
# Database
DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# AI
GOOGLE_AI_API_KEY=AIza...

# App URL
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 3. Custom Domain Setup

**Configure Subdomains:**

1. **Main domain**: `convo.ai` → Vercel app (typically serves marketing pages or redirects)
2. **App subdomain**: `app.convo.ai` → Same Vercel app (routes to `/app/*` via middleware or Vercel config)
3. **Forms subdomain**: `forms.convo.ai` → Same Vercel app (routes to `/forms/*` via middleware or Vercel config)
4. **Admin subdomain**: `admin.convo.ai` → Same Vercel app (routes to `/admin/*` via Vercel rewrite configuration)

**DNS Configuration:**

```
Type    Name    Value
CNAME   @       your-app.vercel.app # Or your Vercel project's specific CNAME target
CNAME   app     your-app.vercel.app
CNAME   forms   your-app.vercel.app
CNAME   admin   your-app.vercel.app
```

**In Vercel Dashboard:**

- Go to Project → Settings → Domains.
- Add `convo.ai`, `app.convo.ai`, `forms.convo.ai`, and `admin.convo.ai`.
- Ensure DNS records are verified.
- **Vercel Rewrites for Subdomains (Example):**
  While `middleware.ts` handles some subdomain logic by inspecting host headers, for clean production URLs like `admin.convo.ai` directly serving content from an application path like `/admin`, Vercel rewrites are often used. This can be configured in `vercel.json` or sometimes directly in the Vercel dashboard settings if simpler path mapping is needed.
  A `vercel.json` might include:
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/marketing/$1",
        "has": [{ "type": "host", "value": "convo.ai" }]
      },
      {
        "source": "/(.*)",
        "destination": "/app/$1",
        "has": [{ "type": "host", "value": "app.convo.ai" }]
      },
      {
        "source": "/(.*)",
        "destination": "/forms/$1",
        "has": [{ "type": "host", "value": "forms.convo.ai" }]
      },
      {
        "source": "/(.*)",
        "destination": "/admin/$1",
        "has": [{ "type": "host", "value": "admin.convo.ai" }]
      }
    ]
  }
  ```
  _Note: The existing `middleware.ts` also performs context switching based on hostnames. Ensure Vercel rewrites and middleware logic are complementary and do not conflict. For instance, middleware might handle the path rewrite internally after Vercel routes the subdomain to the Next.js app, or Vercel rewrites could handle it before the request hits the Next.js app. The project summary indicates middleware handles path-based routing for `app.` and `forms.` by rewriting to `/app` and `/forms` respectively. A similar approach or Vercel rewrites would be needed for `admin.convo.ai` to map to `/admin`._

## 🔧 Alternative Deployment Options

### Railway (Full-Stack Platform)

**Database + App on Railway:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Advantages:**

- Simpler setup (database included)
- Good for beginners
- Automatic scaling

### Render (Docker Deployment)

**Using Docker:**

```dockerfile
# Create Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Deploy to Render:**

- Connect GitHub repo
- Select "Web Service"
- Configure build and start commands

### DigitalOcean App Platform

**Simple Configuration:**

```yaml
# .do/app.yaml
name: convoforms
services:
  - name: web
    source_dir: /
    github:
      repo: your-username/convoforms
      branch: main
    run_command: npm start
    build_command: npm run build
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
```

## 🔐 Production Security Checklist

### Environment Variables

- [ ] All secrets use production values (not test keys)
- [ ] Database URL points to production database
- [ ] Clerk keys are from production instance
- [ ] API keys are from production services

### Database Security

- [ ] Database requires SSL connections
- [ ] Row Level Security (RLS) enabled if using Supabase
- [ ] Database backups configured
- [ ] Connection pooling configured

### Application Security

- [ ] HTTPS enforced for all routes
- [ ] Secure headers configured
- [ ] Rate limiting implemented
- [ ] Input validation on all API routes

### Monitoring & Error Handling

- [ ] Error tracking (Sentry recommended)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Log aggregation

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Database Migrations in Production

**Safe Migration Process:**

```bash
# 1. Test migration locally first
npm run db:generate
npm run db:push

# 2. Backup production database
# (Supabase does this automatically)

# 3. Apply migration to production
# (Usually done automatically via CI/CD)
```

## 📊 Performance Optimization

### Next.js Optimizations

```javascript
// next.config.js
module.exports = {
  // Enable compression
  compress: true,

  // Optimize images
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Enable experimental features
  experimental: {
    serverComponentsExternalPackages: ['@sparticuz/chromium'],
  },
};
```

### Database Optimizations

```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_forms_workspace_id ON forms(workspace_id);
CREATE INDEX idx_responses_form_id ON form_responses(form_id);
CREATE INDEX idx_workspace_members_user_id ON workspace_members(user_id);
```

### CDN Configuration

If using a CDN:

- Cache static assets (CSS, JS, images) for 1 year
- Cache API responses for appropriate durations
- Enable compression (gzip/brotli)

## 🔍 Monitoring & Maintenance

### Essential Monitoring

1. **Uptime monitoring** - Pingdom, UptimeRobot
2. **Error tracking** - Sentry, LogRocket
3. **Performance monitoring** - Vercel Analytics
4. **Database monitoring** - Supabase dashboard

### Regular Maintenance Tasks

- [ ] **Weekly**: Review error logs and fix critical issues
- [ ] **Monthly**: Update dependencies (`npm update`)
- [ ] **Quarterly**: Review and optimize database performance
- [ ] **Annually**: Security audit and penetration testing

### Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    await db
      .select({ count: sql`1` })
      .from(users)
      .limit(1);

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok',
        auth: 'ok',
      },
    });
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        error: error.message,
      },
      { status: 503 }
    );
  }
}
```

## 🚨 Troubleshooting Production Issues

### Common Deployment Issues

**Build Failures:**

```bash
# Check for missing environment variables
# Verify all dependencies are in package.json
# Ensure TypeScript has no errors
```

**Database Connection Issues:**

```bash
# Verify DATABASE_URL is correct
# Check if database accepts connections from Vercel IPs
# Ensure SSL is configured properly
```

**Authentication Issues:**

```bash
# Verify Clerk domain settings
# Check redirect URLs are configured
# Ensure environment variables match
```

### Emergency Response

1. **Monitor error rates** - Set up alerts for >5% error rate
2. **Quick rollback** - Keep previous deployment ready
3. **Status page** - Communicate with users during outages
4. **On-call process** - Define who responds to critical issues

## 📋 Pre-Launch Checklist

### Technical

- [ ] All tests passing
- [ ] Performance audit completed
- [ ] Security scan completed
- [ ] Database backup strategy in place
- [ ] Monitoring configured
- [ ] Error tracking configured
- [ ] CDN configured (if applicable)

### Business

- [ ] Terms of service updated
- [ ] Privacy policy updated
- [ ] GDPR compliance verified
- [ ] Payment processing tested
- [ ] Customer support system ready

### Marketing

- [ ] Domain configured
- [ ] SSL certificate active
- [ ] SEO meta tags configured
- [ ] Analytics tracking configured
- [ ] Social media cards working

This deployment guide ensures you can launch ConvoForms successfully and maintain it in production. Remember to test everything in a staging environment first!
