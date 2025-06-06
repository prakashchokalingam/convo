#!/bin/bash

echo "🚀 Setting up ConvoForms..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment variables
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local
    echo "⚠️  Please update .env.local with your API keys!"
else
    echo "✅ .env.local already exists"
fi

# Create database
echo "🗄️  Setting up database..."
npm run db:generate
npm run db:push

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your API keys:"
echo "   - Clerk (https://clerk.dev)"
echo "   - OpenAI (https://platform.openai.com)"
echo "   - Stripe (https://stripe.com)"
echo ""
echo "2. Run the development server:"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000"
echo ""
echo "Happy coding! 🎉"
