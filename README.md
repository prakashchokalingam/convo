# ConvoForms

> The AI-powered customer engagement platform for building exceptional experiences.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)

## 🚀 Features

- **Intelligent Form Design with AI Assistance** - Create forms from natural language descriptions
- **Conversational Interface** - Transform any form into an engaging conversation
- **Multi-Subdomain Architecture** - Separate apps for different use cases
- **Drag & Drop Builder** - Visual form creation with real-time preview
- **Advanced Analytics** - Deep insights powered by AI
- **Authentication** - Secure user management with Clerk
- **Database** - SQLite with Drizzle ORM for type-safe queries

## 🏗️ Architecture

### Subdomain Structure

- **`mywebsite.com`** - Marketing site and landing pages
- **`app.mywebsite.com`** - Authenticated dashboard and form creation
- **`forms.mywebsite.com`** - Public form filling interface

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Drizzle ORM
- **Authentication**: Clerk
- **Testing**: Vitest + Testing Library
- **AI**: Google Gemini API
- **Deployment**: Vercel

## 📁 Project Structure

```
convo/
├── app/                          # Next.js App Router
│   ├── (app)/                   # App subdomain (app.mywebsite.com)
│   │   ├── (auth)/             # Authentication routes
│   │   ├── dashboard/          # User dashboard
│   │   ├── forms/              # Form management
│   │   └── layout.tsx          # App layout with sidebar
│   ├── (forms)/                # Forms subdomain (forms.mywebsite.com)
│   │   ├── layout.tsx          # Minimal public layout
│   │   └── page.tsx            # Forms landing page
│   ├── (marketing)/            # Main domain (mywebsite.com)
│   │   ├── layout.tsx          # Marketing layout
│   │   └── page.tsx            # Marketing homepage
│   └── api/                    # API routes
├── components/                  # React components
│   ├── app/                    # App-specific components
│   ├── form-builder/           # Form builder components
│   ├── theme/                  # Theme provider
│   └── ui/                     # Reusable UI components
├── lib/                        # Utilities and configuration
│   ├── db/                     # Database schema and config
│   ├── form-builder/           # Form builder logic
│   └── utils.ts                # Helper functions
├── __tests__/                  # Test files
│   ├── components/             # Component tests
│   ├── lib/                    # Library tests
│   ├── utils/                  # Test utilities
│   └── integration/            # Integration tests
├── docs/                       # Documentation
│   ├── development/            # Development guides
│   ├── deployment/             # Deployment guides
│   └── api/                    # API documentation
└── scripts/                    # Build and utility scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/convoforms.git
   cd convoforms
   ```

2. **Run setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Marketing: `http://localhost:3002`
   - App: `http://localhost:3002?subdomain=app`
   - Forms: `http://localhost:3002?subdomain=forms`

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate database migrations
npm run db:push         # Push schema changes to database
npm run db:studio       # Open Drizzle Studio

# Testing
npm test                # Run tests in watch mode
npm run test:run        # Run tests once
npm run test:ui         # Run tests with UI
npm run test:coverage   # Run tests with coverage

# Code Quality
npm run lint            # Lint code
npm run type-check      # Type check
```

### Local Development with Subdomains

#### Option 1: Query Parameters (Recommended)
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

## 🧪 Testing

Our test suite uses Vitest and Testing Library for comprehensive coverage:

- **Unit Tests**: Component and utility testing
- **Integration Tests**: Full workflow testing
- **Coverage**: Detailed coverage reports

```bash
# Run specific test categories
npm test __tests__/components     # Component tests
npm test __tests__/lib           # Library tests
npm test __tests__/integration   # Integration tests
```

## 🚀 Deployment

### Environment Variables

Required environment variables for production:

```env
# Database
DATABASE_URL=

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# AI (Google Gemini)
GOOGLE_AI_API_KEY=

# App URLs
NEXT_PUBLIC_APP_URL=https://app.mywebsite.com
NEXT_PUBLIC_FORMS_URL=https://forms.mywebsite.com
NEXT_PUBLIC_MARKETING_URL=https://mywebsite.com
```

### DNS Configuration

Set up DNS records for subdomain support:

```
A    mywebsite.com        → YOUR_SERVER_IP
A    app.mywebsite.com    → YOUR_SERVER_IP  
A    forms.mywebsite.com  → YOUR_SERVER_IP
```

### Deploy to Vercel

1. **Connect repository to Vercel**
2. **Configure environment variables**
3. **Deploy with automatic subdomain routing**

## 📚 Documentation

- [Development Guide](./docs/development/quickstart.md)
- [Subdomain Setup](./docs/development/subdomain-setup.md)
- [Database Schema](./docs/development/database-schema.md)
- [API Documentation](./docs/api/)
- [Features Overview](./docs/features.md)
- [Roadmap](./docs/roadmap.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Documentation**: Check our [docs](./docs/)
- **Issues**: [GitHub Issues](https://github.com/your-username/convoforms/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/convoforms/discussions)

## 🌟 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Clerk](https://clerk.dev/) for authentication
- [Drizzle ORM](https://orm.drizzle.team/) for database management
- [Vercel](https://vercel.com/) for hosting

---

Made with ❤️ by the ConvoForms team