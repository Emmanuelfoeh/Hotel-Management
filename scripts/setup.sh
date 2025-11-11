#!/bin/bash

# Hotel Management System - Setup Script
# This script helps you set up the project quickly

set -e

echo "🏨 Hotel Management System - Setup Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18.17 or higher from https://nodejs.org"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version is too old${NC}"
    echo "Current version: $(node -v)"
    echo "Required version: 18.17 or higher"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠ PostgreSQL is not installed${NC}"
    echo "Please install PostgreSQL 14 or higher"
    echo "macOS: brew install postgresql@14"
    echo "Ubuntu: sudo apt-get install postgresql-14"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL detected${NC}"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    
    # Generate NEXTAUTH_SECRET
    SECRET=$(openssl rand -base64 32)
    
    # Update .env.local with generated secret
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|your-secret-key-generate-with-openssl-rand-base64-32|$SECRET|g" .env.local
    else
        # Linux
        sed -i "s|your-secret-key-generate-with-openssl-rand-base64-32|$SECRET|g" .env.local
    fi
    
    echo -e "${GREEN}✓ .env.local created with generated secret${NC}"
    echo -e "${YELLOW}⚠ Please update other environment variables in .env.local${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi

# Ask if user wants to create database
echo ""
read -p "Do you want to create the database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Creating database..."
    
    # Extract database name from .env.local
    DB_NAME=$(grep DATABASE_URL .env.local | cut -d'/' -f4 | cut -d'?' -f1)
    
    if [ -z "$DB_NAME" ]; then
        DB_NAME="hotel_db"
    fi
    
    # Create database
    createdb "$DB_NAME" 2>/dev/null || echo -e "${YELLOW}⚠ Database may already exist${NC}"
    
    echo -e "${GREEN}✓ Database created${NC}"
fi

# Run migrations
echo ""
read -p "Do you want to run database migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running migrations..."
    npm run db:migrate
    echo -e "${GREEN}✓ Migrations completed${NC}"
fi

# Seed database
echo ""
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding database..."
    npm run db:seed
    echo -e "${GREEN}✓ Database seeded${NC}"
    echo ""
    echo "Default admin credentials:"
    echo "Email: admin@hotel.com"
    echo "Password: admin123"
fi

# Setup complete
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update environment variables in .env.local"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000"
echo ""
echo "For more information, see:"
echo "- README.md"
echo "- docs/QUICK-START.md"
echo ""
echo "Happy coding! 🚀"
