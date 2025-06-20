# ConvoForms Documentation

Welcome to the central documentation hub for ConvoForms! This page provides an overview of all technical documentation available.

## 🚀 Getting Started & Core Concepts

- **[Getting Started](./GETTING_STARTED.md)**: Your first stop. Detailed guide to set up the project, understand prerequisites, and run ConvoForms locally.
- **[Features](./features.md)**: Discover what ConvoForms can do, from AI form generation to conversational mode and team collaboration.
- **[Architecture](./ARCHITECTURE.md)**: Deep dive into the system design, URL structure, file organization, data flow, AI integration, and security aspects.

## 🛠️ Development & Contribution

- **[Development Guide](./DEVELOPMENT.md)**: Comprehensive guide for daily development, including database operations, testing contexts, common tasks, debugging, file organization, and Git workflow.
- **[Environment Variables](./ENVIRONMENT.md)**: Details on configuring necessary environment variables for local development and production.
- **[API Documentation](./API_DOCUMENTATION.md)**: Information regarding the backend API endpoints. (Note: Also see the Swagger section for generated API docs).
- **[End-to-End Testing](./E2E_TESTING.md)**: Guide on how E2E tests are structured and how to run them.

## 🎨 Design System

- **[Design Overview](./design/README.md)**: Introduction to our design philosophy and the `shadcn/ui` based design system.
- **[shadcn/ui Design System](./design/shadcn-ui-design-system.md)**: Detailed specification of the UI design system.
- **[Component Architecture](./design/shadcn-component-architecture.md)**: Patterns and structure for UI components.

## 🚀 Deployment & Operations

- **[Deployment Guide](./DEPLOYMENT.md)**: Step-by-step instructions for deploying ConvoForms to production environments, including recommended setups (Vercel + Supabase) and alternative options.

## ⚙️ Advanced Topics & Specific Implementations

- **[Swagger API Generation](./swagger/)**: Information on how API documentation is generated using Swagger. You can find the generated OpenAPI spec in the `swagger/generated/` subdirectory.
- **[Implementation: Automatic Workspace Creation](./implementation-automatic-workspace-creation.md)**: Technical details on the automatic workspace creation feature.
- **[Implementation: Workspace Type Migration](./implementation-workspace-type-migration.md)**: Documentation for migrating workspace types.
- **[Priority Action Plan](./PRIORITY_ACTION_PLAN.md)**: Document outlining priority tasks (may be more for project management).

## 🧪 Test Cases & Quality Assurance

- **[Test Cases Overview](./cases/README.md)**: Introduction to how test cases are organized and structured for various features.
    - **Authentication Cases**: `cases/authentication.md`
    - **Form Builder Cases**: `cases/form-builder.md`
    - **Form Generation Cases**: `cases/form-generation.md`
    - ... and many more specific feature test cases in `docs/cases/`.

## 🗂️ Other Documentation

- **[E2E Quick Start Guide](../../E2E_QUICK_START.md)**: A guide for getting started with E2E testing. (Located in root)
- **[Workspace Implementation Details](../../WORKSPACE_IMPLEMENTATION.md)**: Details on workspace implementation. (Located in root)

---

Explore these documents to gain a comprehensive understanding of ConvoForms. If you find any discrepancies or areas for improvement, please feel free to contribute!
