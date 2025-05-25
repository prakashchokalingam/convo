# ConvoForms - AI-Powered Conversational Form Builder

Transform boring forms into engaging conversations. Build forms with AI, boost completion rates by 2-3x.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Set up database
npm run db:generate
npm run db:push

# Run development server
npm run dev
```

## 📁 Project Structure

```
convo/
├── app/                    # Next.js app router
│   ├── (auth)/            # Auth pages (sign-in, sign-up)
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── (marketing)/       # Public pages
│   ├── api/               # API routes
│   └── f/[id]/           # Public form pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form-specific components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utilities and configurations
│   ├── db/               # Database schema and queries
│   ├── ai/               # OpenAI integration
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── prompts/              # AI prompt templates
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: Clerk
- **Database**: SQLite (dev) → Turso (prod)
- **ORM**: Drizzle
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: OpenAI GPT-4
- **Payments**: Stripe
- **Email**: Resend
- **Hosting**: Vercel

## 📝 Key Features

1. **AI Form Generation**: Convert natural language to form schemas
2. **Conversational Mode**: Toggle any form into a chat interface
3. **Real-time Analytics**: Track completions and drop-offs
4. **Subscription Tiers**: Free, Pro, and Enterprise plans
5. **Embeddable Widgets**: Use forms anywhere

## 🔧 Development Commands

```bash
# Database
npm run db:generate    # Generate migrations
npm run db:push       # Apply migrations
npm run db:studio     # Open Drizzle Studio

# Development
npm run dev           # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
```

## 📊 Subscription Plans

### Free
- 3 forms
- 100 submissions/month
- Basic analytics

### Pro ($29/month)
- Unlimited forms
- 2,500 submissions/month
- AI analytics
- Integrations

### Enterprise ($99/month)
- Everything in Pro
- 10,000+ submissions
- Team features
- API access
- Priority support

## 🚦 MVP Roadmap

- [x] Week 1-2: Foundation setup
- [ ] Week 3-4: AI form generation
- [ ] Week 5-6: Form builder UI
- [ ] Week 7-8: Conversational mode
- [ ] Week 9-10: Payments & Launch

## 📈 Success Metrics

- Week 4: First user-created form
- Week 8: First paid customer
- Month 3: $500 MRR
- Month 6: $2,000 MRR

## 🤝 Contributing

This is a solo project, but feedback and suggestions are welcome!

## 📜 License

All rights reserved. This is proprietary software.

---

Built with ❤️ by Prakash
