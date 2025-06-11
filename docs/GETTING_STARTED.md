# 🚀 Getting Started with ConvoForms

Welcome to ConvoForms! This guide will get you up and running in 10 minutes.

## What is ConvoForms?

ConvoForms is an AI-powered form builder that turns boring static forms into engaging conversations. Users can:
- Generate forms using natural language prompts ("Create a job application form")
- Toggle any form into "conversational mode" (chat-like interface)
- Collect responses and analyze data

## Prerequisites

You'll need these installed:
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

## Quick Setup (5 minutes)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd convo
npm install
```

### 2. Environment Setup
```bash
# Copy the example environment file
cp .env.local.example .env.local
```

Edit `.env.local` with your API keys:
```bash
# Database (this works out of the box for local development)
DATABASE_URL="postgresql://convoforms:convoforms_dev_password@localhost:5432/convoforms"

# Authentication - Get these from https://clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# AI Provider - Get from https://makersuite.google.com/app/apikey
GOOGLE_AI_API_KEY=AIza...
```

### 3. Start Database
```bash
# This starts PostgreSQL in a Docker container
npm run db:up

# Wait 5 seconds, then create tables
npm run db:push
```

### 4. Start Development Server
```bash
npm run dev
```

🎉 **Success!** Open http://localhost:3002 to see your app.

## What You'll See

1. **Marketing Homepage** - Landing page explaining the product
2. **Sign Up Flow** - Create account and workspace
3. **Dashboard** - Main app interface
4. **Form Builder** - Create and edit forms
5. **Conversational Mode** - Toggle to chat interface

## Your First Form

1. Sign up for an account
2. Create a workspace
3. Click "Create Form"
4. Type: "Create a contact form with name, email, and message"
5. Watch AI generate your form
6. Toggle "Conversational Mode" to see it as a chat
7. Test it out!

## Key URLs in Development

- **Marketing**: `http://localhost:3002/`
- **App Login**: `http://localhost:3002/login?subdomain=app`
- **Dashboard**: `http://localhost:3002/[workspace]?subdomain=app`
- **Public Form**: `http://localhost:3002/contact/[form-id]?subdomain=forms`

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand how it's built
- Check [DEVELOPMENT.md](./DEVELOPMENT.md) for daily workflow
- Look at [FEATURES.md](./FEATURES.md) to see what's possible

## Troubleshooting

**Database won't start?**
```bash
# Check if Docker is running
docker ps

# Reset database (nuclear option)
npm run db:reset
```

**Environment variables not loading?**
```bash
# Check your .env.local file exists and has the right keys
cat .env.local
```

**Need help?** Check the troubleshooting section in the main README or create an issue.
