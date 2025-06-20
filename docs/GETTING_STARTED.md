# 🚀 Getting Started with ConvoForms

Welcome to ConvoForms! This guide picks up after you've cloned the repository and installed dependencies as outlined in the main `README.md`. It will help you get the application running locally.

## What is ConvoForms?

ConvoForms is an AI-powered form builder that turns boring static forms into engaging conversations. Users can:
- Generate forms using natural language prompts ("Create a job application form")
- Toggle any form into "conversational mode" (chat-like interface)
- Collect responses and analyze data

## Prerequisites

Before you proceed, ensure you have the following installed:
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - (You should already have this if you've cloned the repository)

The main `README.md` covers the initial `git clone` and `npm install` steps.

## Detailed Setup

### 1. Environment Setup
After cloning and running `npm install`, you need to set up your environment variables:

```bash
# Copy the example environment file
cp .env.local.example .env.local
```

Edit `.env.local` with your API keys. This file is pre-configured for local development database access but requires your specific API keys for external services:
```bash
# Database (this works out of the box for local development)
DATABASE_URL="postgresql://convoforms:convoforms_dev_password@localhost:5432/convoforms"

# Authentication - Get these from https://clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... # Replace with your actual publishable key
CLERK_SECRET_KEY=sk_test_... # Replace with your actual secret key

# AI Provider - Get from https://makersuite.google.com/app/apikey
GOOGLE_AI_API_KEY=AIza... # Replace with your actual API key
```
**Important:** Ensure you replace placeholder keys with your actual API keys for full functionality.

### 2. Start Local Database
ConvoForms uses PostgreSQL via Docker for local development.

```bash
# This starts PostgreSQL in a Docker container
npm run db:up
```
Wait for a few moments for the database container to initialize. Then, apply the database schema:
```bash
# Create tables and apply schema
npm run db:push
```

### 3. Start Development Server
Once the database is ready and schema is applied:
```bash
npm run dev
```

🎉 **Success!** Open [http://localhost:3002](http://localhost:3002) in your browser to see your ConvoForms application.

## What You'll See

1.  **Marketing Homepage** - The initial landing page explaining the product.
2.  **Sign Up Flow** - You'll be able to create an account and set up your first workspace.
3.  **Dashboard** - After signing in, you'll land on the main application interface.
4.  **Form Builder** - Explore creating and editing forms.
5.  **Conversational Mode** - Test toggling forms into the chat-like interface.

## Your First Form (Quick Guide)

1.  Sign up for an account through the application.
2.  Create a workspace when prompted.
3.  From the dashboard, click "Create Form".
4.  Try an AI prompt, for example: "Create a contact form with name, email, and message fields."
5.  Observe the AI generating your form.
6.  Toggle "Conversational Mode" to experience the chat interface.
7.  Test submitting the form.

## Key URLs in Development

- **Marketing Site**: `http://localhost:3002/`
- **Application Login**: `http://localhost:3002/login?subdomain=app` (or navigate through the marketing site)
- **Your Workspace Dashboard (example)**: `http://localhost:3002/your-workspace-slug?subdomain=app`
- **Public Form URL (example)**: `http://localhost:3002/contact/your-form-id?subdomain=forms`

## Next Steps

With the application running, you might want to:
- Read the **[Architecture Document](./ARCHITECTURE.md)** to understand how ConvoForms is built.
- Check the **[Development Guide](./DEVELOPMENT.md)** for insights into the daily development workflow, coding standards, and more.
- Explore the **[Features Overview](./features.md)** to see the full capabilities of ConvoForms.

## Troubleshooting

**Database won't start or `db:push` fails?**
- Ensure Docker Desktop is running.
- Check Docker container logs: `docker logs <container_name_or_id>` (you can find the container name via `docker ps`).
- As a last resort, you can reset the local database (this will delete all local data):
  ```bash
  npm run db:reset
  # Then try npm run db:up and npm run db:push again
  ```

**Environment variables not loading?**
- Double-check that your file is named exactly `.env.local` in the root of the project.
- Ensure the keys in `.env.local` match those expected by the application (refer to `.env.local.example`).
- Restart the development server (`npm run dev`) after any changes to `.env.local`.

**Need more help?**
- Check the troubleshooting sections in other specific documentation files.
- If you encounter a bug or an undocumented issue, please create an issue in the project repository.
```
