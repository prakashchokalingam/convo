#!/bin/bash

# E2E Testing Setup Script for ConvoForms
# This script sets up and runs the complete E2E testing environment

set -e

echo "🚀 ConvoForms E2E Testing Setup"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -f "playwright.config.ts" ]; then
    print_error "Please run this script from the ConvoForms root directory"
    exit 1
fi

print_status "Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if Docker is installed (for database)
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

print_success "Prerequisites check passed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_status "Dependencies already installed"
fi

# Install Playwright browsers if they don't exist
print_status "Checking Playwright browsers..."
if ! npx playwright --version &> /dev/null; then
    print_error "Playwright not found. Installing..."
    npm install @playwright/test
fi

# Check if browsers are installed
if ! ls ~/.cache/ms-playwright/chromium-* &> /dev/null 2>&1 && ! ls ~/Library/Caches/ms-playwright/chromium-* &> /dev/null 2>&1; then
    print_status "Installing Playwright browsers..."
    npx playwright install
    print_success "Playwright browsers installed"
else
    print_status "Playwright browsers already installed"
fi

# Check if environment file exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. You may need to create it based on .env.local.example"
    if [ -f ".env.local.example" ]; then
        print_status "Example environment file found. Consider copying it:"
        echo "cp .env.local.example .env.local"
    fi
fi

# Start database if not running
print_status "Starting database..."
if ! docker ps | grep -q postgres; then
    npm run db:up
    print_success "Database started"
    # Wait a moment for database to be ready
    sleep 3
else
    print_status "Database already running"
fi

# Check database connectivity
print_status "Checking database connectivity..."
if npm run db:push > /dev/null 2>&1; then
    print_success "Database connection verified"
else
    print_warning "Database connection issue. Make sure your .env.local is configured correctly"
fi

# Function to start dev server and wait for it to be ready
start_dev_server() {
    print_status "Starting development server..."
    
    # Check if dev server is already running
    if curl -s http://localhost:3002 > /dev/null 2>&1; then
        print_status "Development server already running"
        return 0
    fi
    
    # Start dev server in background
    npm run dev &
    DEV_PID=$!
    
    # Wait for server to be ready (max 60 seconds)
    for i in {1..60}; do
        if curl -s http://localhost:3002 > /dev/null 2>&1; then
            print_success "Development server ready"
            return 0
        fi
        sleep 1
        echo -n "."
    done
    
    print_error "Development server failed to start within 60 seconds"
    kill $DEV_PID 2>/dev/null || true
    return 1
}

# Parse command line arguments
COMMAND=${1:-"validate"}
TEST_FILE=${2:-""}

case $COMMAND in
    "setup")
        print_success "E2E environment setup complete!"
        print_status "Next steps:"
        echo "  1. Run 'npm run test:e2e' to run all tests"
        echo "  2. Run 'npm run test:e2e:ui' for interactive testing"
        echo "  3. Run 'npm run test:e2e:headed' to see tests in browser"
        ;;
    
    "validate")
        print_status "Running setup validation..."
        start_dev_server
        
        print_status "Running validation tests..."
        if npx playwright test setup-validation.spec.ts --reporter=line; then
            print_success "E2E setup validation passed!"
        else
            print_error "E2E setup validation failed"
            exit 1
        fi
        ;;
    
    "test")
        print_status "Running E2E tests..."
        start_dev_server
        
        if [ -n "$TEST_FILE" ]; then
            print_status "Running specific test: $TEST_FILE"
            npx playwright test "$TEST_FILE"
        else
            print_status "Running all E2E tests..."
            npx playwright test
        fi
        ;;
    
    "ui")
        print_status "Starting E2E tests in UI mode..."
        start_dev_server
        npx playwright test --ui
        ;;
    
    "headed")
        print_status "Running E2E tests in headed mode..."
        start_dev_server
        npx playwright test --headed
        ;;
    
    "debug")
        print_status "Starting E2E tests in debug mode..."
        start_dev_server
        npx playwright test --debug
        ;;
    
    "codegen")
        print_status "Starting Playwright codegen..."
        start_dev_server
        npx playwright codegen localhost:3002
        ;;
    
    "clean")
        print_status "Cleaning up test artifacts..."
        rm -rf test-results/
        rm -rf playwright-report/
        rm -rf .auth/
        print_success "Test artifacts cleaned"
        ;;
    
    "help")
        echo "ConvoForms E2E Testing Script"
        echo ""
        echo "Usage: $0 [command] [test-file]"
        echo ""
        echo "Commands:"
        echo "  setup     - Set up E2E environment only"
        echo "  validate  - Validate E2E setup (default)"
        echo "  test      - Run E2E tests [optional: specific test file]"
        echo "  ui        - Run tests in UI mode"
        echo "  headed    - Run tests in headed mode"
        echo "  debug     - Run tests in debug mode"
        echo "  codegen   - Start Playwright code generator"
        echo "  clean     - Clean test artifacts"
        echo "  help      - Show this help"
        echo ""
        echo "Examples:"
        echo "  $0 setup"
        echo "  $0 validate"
        echo "  $0 test"
        echo "  $0 test auth-onboarding.spec.ts"
        echo "  $0 ui"
        echo "  $0 codegen"
        ;;
    
    *)
        print_error "Unknown command: $COMMAND"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac

print_success "E2E script completed successfully!"
