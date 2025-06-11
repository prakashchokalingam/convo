#!/bin/bash

# 🔍 ConvoForms Health Check Script
# Verifies that everything is working correctly

echo "🔍 ConvoForms Health Check"
echo "========================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file missing"
    echo "   Run: cp .env.local.example .env.local"
    exit 1
else
    echo "✅ .env.local exists"
fi

# Check DATABASE_URL
if grep -q "postgresql://" .env.local; then
    echo "✅ DATABASE_URL configured for PostgreSQL"
else
    echo "❌ DATABASE_URL not configured for PostgreSQL"
    exit 1
fi

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker not running"
    echo "   Please start Docker"
    exit 1
else
    echo "✅ Docker running"
fi

# Check PostgreSQL container
if docker-compose ps | grep -q "convo-forms-postgres.*Up"; then
    echo "✅ PostgreSQL container running"
else
    echo "⚠️  PostgreSQL container not running"
    echo "   Starting PostgreSQL..."
    npm run db:up > /dev/null 2>&1
    sleep 3
    if docker-compose ps | grep -q "convo-forms-postgres.*Up"; then
        echo "✅ PostgreSQL container started"
    else
        echo "❌ Failed to start PostgreSQL"
        exit 1
    fi
fi

# Test database connection
echo "🔌 Testing database connection..."
if docker-compose exec -T postgres pg_isready -U convoforms -d convoforms > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Test Drizzle commands
echo "🧪 Testing Drizzle commands..."
if npm run db:push > /dev/null 2>&1; then
    echo "✅ Drizzle commands working"
else
    echo "❌ Drizzle commands failed"
    exit 1
fi

# Check if tables exist
echo "📊 Checking database tables..."
TABLES=$(docker-compose exec -T postgres psql -U convoforms -d convoforms -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' \n')
if [ "$TABLES" -eq "5" ]; then
    echo "✅ All 5 tables exist (forms, responses, conversations, form_analytics, subscriptions)"
else
    echo "❌ Expected 5 tables, found $TABLES"
    echo "   Run: npm run db:push"
    exit 1
fi

echo ""
echo "🎉 All systems healthy!"
echo ""
echo "Ready for development:"
echo "  npm run dev"
echo ""
echo "Database management:"
echo "  npm run db:studio    # Drizzle Studio"
echo "  npm run pgadmin      # pgAdmin Web UI"
echo ""
echo "Your app will be at: http://localhost:3002"
