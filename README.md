# ConvoForms - AI-Powered Conversational Form Builder

> **Engineering Overview**: Transform static forms into conversational experiences with AI. Built with Next.js 14, PostgreSQL, and Google Gemini.

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone <your-repo-url> # Replace <your-repo-url> with the actual repository URL
cd convoforms # Adjust if your project directory name is different
npm install
```

For detailed setup including environment configuration, prerequisites, and troubleshooting, please see our comprehensive **[Getting Started Guide](./docs/GETTING_STARTED.md)**.

## 📚 Engineering Documentation

For a complete overview and navigation of all technical documents, please visit our **[Documentation Hub](./docs/README.md)**.

### ✨ For New Developers

If you're new to ConvoForms, we recommend starting with these documents to get up to speed quickly:

1.  🚀 **[Getting Started Guide](./docs/GETTING_STARTED.md)**: Covers setting up your local development environment and making your first contributions.
2.  🏗️ **[Architecture Overview](./docs/ARCHITECTURE.md)**: Explains the high-level structure of the application, key technologies, and how different parts interact.
3.  🛠️ **[Development Workflow](./docs/DEVELOPMENT.md)**: Details our coding standards, testing procedures, and day-to-day development practices.

### 🔑 Key Documents

- 🚀 **[Getting Started](./docs/GETTING_STARTED.md)** - Detailed setup and first steps.
- 🏗️ **[Architecture](./docs/ARCHITECTURE.md)** - System design and structure.
- 🛠️ **[Development Guide](./docs/DEVELOPMENT.md)** - Workflow, testing, and contribution.
- ✨ **[Features](./docs/features.md)** - Overview of ConvoForms capabilities.
- 📖 **[Documentation Structure](./docs/docs_structure.md)** - A guide to how our documentation is organized.
- 🚀 **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deploying to production.
- 🎨 **[Design System](./docs/design/README.md)** - UI components and styling guidelines.
- 🗂️ **[Use Cases & Scenarios](./docs/cases/README.md)** - Detailed documentation for specific scenarios, edge cases, or in-depth explanations of particular features or past technical decisions.

A comprehensive list of all documents can be found in the **[Documentation Hub](./docs/README.md)**.

## 🏗️ Technical Architecture

### Core Stack

```
Frontend:    Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
Database:    PostgreSQL + Drizzle ORM
Auth:        Clerk Authentication
AI:          Google Gemini API
Deployment:  Vercel + Supabase
Testing:     Vitest (unit) + Playwright (E2E)
```

### Project Structure

```
app/
├── (marketing)/           # Marketing site
├── (app)/                 # SaaS application
├── (forms)/               # Public form rendering
└── api/                   # Backend API routes

components/
├── ui/                    # shadcn/ui base components
├── app/                   # App-specific components
├── marketing/             # Marketing components
└── forms/                 # Form rendering components

lib/
├── db/                    # Database utilities
├── ai/                    # AI integration
├── auth/                  # Authentication helpers
└── utils/                 # Shared utilities
```

### URL Architecture

```
Development URLs:
Marketing:     localhost:3002/marketing
App:           localhost:3002/app/[workspace]
Forms:         localhost:3002/forms/[workspace]/[form]

Production URLs:
Marketing:     convo.ai
App:           app.convo.ai/[workspace]
Forms:         forms.convo.ai/[workspace]/[form]
```

For a more in-depth explanation of the architecture, see the **[Full Architecture Document](./docs/ARCHITECTURE.md)**.

### Admin Dashboard

The application includes an admin dashboard accessible to authorized users.

- **Development URL**: `localhost:3002/admin` (after logging in as an admin user)
- **Production URL**: `admin.convo.ai` (requires DNS and Vercel rewrite configuration)
- **Access Control**: Managed by the `ADMIN_EMAILS` environment variable.

## 🔧 Development Commands

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `npm run dev`         | Start development server (port 3002) |
| `npm run db:up`       | Start PostgreSQL database            |
| `npm run db:studio`   | Open Drizzle Studio (database GUI)   |
| `npm run db:push`     | Apply schema changes to database     |
| `npm run db:generate` | Generate migration files             |
| `npm test`            | Run unit tests (Vitest)              |
| `npm run test:e2e`    | Run E2E tests (Playwright)           |
| `npm run build`       | Build for production                 |
| `npm run lint`        | Run ESLint                           |
| `npm run type-check`  | Run TypeScript checks                |

For detailed explanations of the development workflow, database management, and more, refer to the **[Development Guide](./docs/DEVELOPMENT.md)**.

## 🧪 Testing Strategy

### Unit & Integration Testing

```bash
npm test       # Run all unit/integration tests
npm run test:watch # Run tests in watch mode
```

### End-to-End Testing

```bash
npm run test:e2e # Run all E2E tests
```

For more details on testing strategies, writing tests, and specific test cases, please see the **[Development Guide](./docs/DEVELOPMENT.md)** and **[E2E Testing Guide](./docs/E2E_TESTING.md)**.

## 🗃️ Database Management

### Schema Development

```bash
# 1. Edit schema: lib/db/schema.ts
# 2. Generate migration: npm run db:generate
# 3. Apply changes: npm run db:push
# 4. View database: npm run db:studio
```

Detailed database information, including schema and management, is covered in the **[Development Guide](./docs/DEVELOPMENT.md)** and **[Architecture Document](./docs/ARCHITECTURE.md)**.

## 🎨 Design System

ConvoForms uses a design system based on shadcn/ui to ensure a professional, accessible, and maintainable user interface.
Learn more about our **[Design System and Component Architecture](./docs/design/README.md)**.

## 🔐 Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# AI (Google Gemini)
GOOGLE_AI_API_KEY=AIza...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3002
NODE_ENV=development

# Admin Dashboard
ADMIN_EMAILS="admin1@example.com,admin2@example.com" # Comma-separated list of emails allowed to access the admin dashboard.

# Slack Notifications
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX" # Webhook URL for Slack notifications (e.g., for new workspace creations)
```

## 🚀 Deployment

### Production Stack

- **Frontend/API**: Vercel
- **Database**: Supabase PostgreSQL
- **Auth**: Clerk
- **Storage**: Vercel Blob (optional)
- **Monitoring**: Vercel Analytics

See the **[Deployment Guide](./docs/DEPLOYMENT.md)** for detailed instructions.

## 🔍 Development Workflow

### Feature Development

1. **Branch**: Create feature branch from `main`
2. **Develop**: Code with tests
3. **Test**: Run unit and E2E tests
4. **Review**: Create pull request
5. **Deploy**: Merge to `main` auto-deploys

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Tests**: Unit + E2E coverage
- **Accessibility**: WCAG compliance

## 📄 License

MIT License - see LICENSE file for details.

---

**Built for developers, by developers.**

_Need help? Check the [Full Documentation Hub](./docs/README.md) or create an issue._
