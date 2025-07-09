# Documentation Structure Guide

Welcome to the ConvoForms documentation! This guide explains how our documentation is organized to help you find the information you need efficiently.

The main entry point for all documentation is the **[Documentation Hub](./README.md)**.

## Core Documents

These documents provide fundamental information about the project:

- **`GETTING_STARTED.md`**: Essential for new developers. Covers initial project setup, prerequisites, running the application locally, and a first-time user guide. Includes a high-level overview of the project structure.
- **`ARCHITECTURE.md`**: A deep dive into the technical architecture of ConvoForms. Explains the overall system design, URL structure, file organization, data flow, AI integration, database schema, security considerations, and deployment architecture.
- **`DEVELOPMENT.md`**: Your guide to day-to-day development. Covers coding standards, Git workflow, database management, running tests (unit, integration, E2E), debugging techniques, and common development tasks.
- **`features.md`**: An overview of the key features and capabilities of ConvoForms from a user and technical perspective.

## Topical Guides & Resources

These documents cover specific aspects of the project:

- **`ENVIRONMENT.md`**: Details all necessary environment variables for local development and production setups, including how to obtain them.
- **`API_DOCUMENTATION.md`**: Provides a general overview of our backend API, its conventions, and authentication methods. For detailed, auto-generated API specifications, see the `swagger/` directory.
- **`DEPLOYMENT.md`**: Step-by-step instructions for deploying ConvoForms to various environments, with a focus on our recommended Vercel + Supabase stack.
- **`E2E_TESTING.md`**: A specific guide on how End-to-End tests are structured using Playwright, how to write new E2E tests, and how to run them.

### Subdirectories

- **`design/`**: Contains documentation related to the UI/UX design system.
  - `README.md`: Introduction to our design philosophy and the `shadcn/ui` based design system.
  - `shadcn-ui-design-system.md`: Detailed specification of the UI design system, components, and usage.
  - `shadcn-component-architecture.md`: Patterns and best practices for creating and structuring UI components.

- **`swagger/`**: Houses the OpenAPI (Swagger) specification for our API.
  - `README.md`: Explains how Swagger is used in this project and how to (re)generate the API specification.
  - `generated/openapi.json`: The auto-generated OpenAPI specification file. This is the source of truth for API endpoint details.
  - Other files here support the generation and configuration of the Swagger documentation.

- **`cases/`**: This directory is a knowledge base for specific scenarios, detailed use-case walkthroughs, or in-depth explanations of particular features, bugs, or past technical decisions.
  - `README.md`: Provides an overview and index of the documents within this directory.
  - Each `.md` file in `cases/` describes a specific situation (e.g., `authentication.md`, `form-builder.md`). These are useful for understanding the nuances of certain functionalities or historical context.

- **`guides/`**: Contains specific, actionable guides for certain tasks.
  - `E2E_QUICK_START.md`: A focused guide to quickly get started with running and understanding End-to-End tests.

- **`technical_details/`**: Contains documents that provide in-depth information about specific backend implementations or complex features.
  - `implementation-automatic-workspace-creation.md`: Details the backend logic for how workspaces are automatically created for new users.
  - `implementation-workspace-type-migration.md`: Explains the process and technical considerations for migrating workspace types.
  - `WORKSPACE_IMPLEMENTATION.md`: Provides a comprehensive look at the workspace entity, its data model, and associated business logic.

## Root Level Project Files (Informational)

While most documentation is in the `docs/` folder, some important markdown files exist in the project root:

- **`README.md` (Root)**: The main entry point to the project for anyone browsing the repository. Provides a project overview, quick start instructions, and links to key documentation (especially the `docs/README.md`).
- Other files like `PACKAGE_FIXES.md`, etc., that might exist in the root often contain specific, sometimes temporary, notes or historical context. The goal is to integrate relevant information from these into the `docs/` folder over time.

## Finding Information

1.  **Start with `README.md` (Root)** if you're completely new.
2.  **Use `docs/README.md` (Documentation Hub)** as your main navigation page for all technical docs.
3.  **Consult this `docs_structure.md` file** if you're unsure where to find information on a particular topic.
4.  **Use your IDE's search functionality** across the `docs/` folder if you're looking for specific keywords.

We strive to keep this documentation up-to-date and comprehensive. If you find anything missing or unclear, please feel free to contribute or raise an issue!
