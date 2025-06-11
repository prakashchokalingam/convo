#!/bin/bash

# 🚀 ConvoForms Auto Setup Script
# This script sets up the entire development environment

set -e  # Exit on any error

echo "🤖 ConvoForms Setup Starting..."
echo "================================="

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "18" ]; then
    echo "❌ Node.js version is $NODE_VERSION. Please upgrade to Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker and try again."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker detected and running"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Setup environment
echo ""
echo "⚙️ Setting up environment..."
if [ ! -f ".env.local" ]; then
    cp .env.local.example .env.local
    echo "✅ Created .env.local from template"
    echo "⚠️  Please edit .env.local with your API keys before continuing"
else
    echo "✅ .env.local already exists"
fi

# Start database
echo ""
echo "🗄️ Starting PostgreSQL database..."
npm run db:up

# Wait for database to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Test database connection
echo "🔌 Testing database connection..."
if docker-compose exec -T postgres pg_isready -U convoforms -d convoforms > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ Failed to connect to PostgreSQL. Waiting a bit more..."
    sleep 5
    if docker-compose exec -T postgres pg_isready -U convoforms -d convoforms > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready"
    else
        echo "❌ PostgreSQL connection failed. Please check Docker logs: npm run db:logs"
        exit 1
    fi
fi

# Push database schema
echo ""
echo "📊 Setting up database schema..."
npm run db:push

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "🚀 Your ConvoForms development environment is ready!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys:"
echo "   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "   - CLERK_SECRET_KEY"
echo "   - GOOGLE_AI_API_KEY (or OPENAI_API_KEY)"
echo ""
echo "2. Start development:"
echo "   npm run dev"
echo ""
echo "3. Access your app:"
echo "   - App: http://localhost:3002"
echo "   - Database Studio: npm run db:studio"
echo "   - pgAdmin: npm run pgadmin (http://localhost:5050)"
echo ""
echo "📖 For more info, check README.md"
echo ""
echo "Happy coding! 🎯"
