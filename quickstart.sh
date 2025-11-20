#!/bin/bash

# EduPro+ Quick Start Script
# This script helps you get the project running quickly

echo "🎓 Welcome to EduPro+ Setup"
echo "================================"
echo ""

# Check if running in correct directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."
echo ""

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js $NODE_VERSION installed"
else
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm $NPM_VERSION installed"
else
    echo "❌ npm is not installed"
    exit 1
fi

# Check Docker (optional)
if command_exists docker; then
    DOCKER_VERSION=$(docker -v)
    echo "✅ Docker installed"
    HAS_DOCKER=true
else
    echo "⚠️  Docker not found (optional for quick start)"
    HAS_DOCKER=false
fi

echo ""
echo "================================"
echo ""

# Ask user for setup method
echo "Choose setup method:"
echo "1) Docker (Recommended - easiest)"
echo "2) Manual setup (requires PostgreSQL, MongoDB, Redis)"
echo ""
read -p "Enter choice (1 or 2): " SETUP_CHOICE

if [ "$SETUP_CHOICE" = "1" ]; then
    if [ "$HAS_DOCKER" = false ]; then
        echo "❌ Docker is not installed. Please install Docker first or choose manual setup."
        exit 1
    fi
    
    echo ""
    echo "🐳 Starting Docker setup..."
    echo ""
    
    # Check if docker-compose or docker compose works
    if command_exists docker-compose; then
        COMPOSE_CMD="docker-compose"
    else
        COMPOSE_CMD="docker compose"
    fi
    
    echo "📦 Building and starting all services..."
    $COMPOSE_CMD up -d
    
    echo ""
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🌐 Access the application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:5000"
    echo "   Health:   http://localhost:5000/health"
    echo ""
    echo "📊 View logs:"
    echo "   $COMPOSE_CMD logs -f"
    echo ""
    echo "🛑 Stop services:"
    echo "   $COMPOSE_CMD down"
    echo ""
    
elif [ "$SETUP_CHOICE" = "2" ]; then
    echo ""
    echo "🔧 Starting manual setup..."
    echo ""
    
    # Backend setup
    echo "📦 Setting up backend..."
    cd backend
    
    if [ ! -f ".env" ]; then
        echo "📝 Creating .env file..."
        cp .env.example .env
        echo "⚠️  Please edit backend/.env with your database credentials"
        read -p "Press Enter to continue after updating .env..."
    fi
    
    echo "📥 Installing backend dependencies..."
    npm install
    
    echo "🗄️  Setting up database..."
    echo "⚠️  Make sure PostgreSQL, MongoDB, and Redis are running!"
    read -p "Press Enter to continue..."
    
    npx prisma generate
    npx prisma migrate dev --name init
    
    echo "✅ Backend setup complete!"
    echo ""
    
    # Frontend setup
    echo "📦 Setting up frontend..."
    cd ../frontend
    
    if [ ! -f ".env" ]; then
        echo "📝 Creating frontend .env file..."
        echo "VITE_API_URL=http://localhost:5000/api/v1" > .env
    fi
    
    echo "📥 Installing frontend dependencies..."
    npm install
    
    echo "✅ Frontend setup complete!"
    echo ""
    
    # Start instructions
    echo "================================"
    echo "🚀 To start the application:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "   cd backend"
    echo "   npm run dev"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "   cd frontend"
    echo "   npm run dev"
    echo ""
    echo "Then access:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:5000"
    echo ""
    
else
    echo "❌ Invalid choice. Please run the script again."
    exit 1
fi

echo "================================"
echo "📚 Documentation:"
echo "   README.md - Project overview"
echo "   SETUP.md - Detailed setup guide"
echo "   ARCHITECTURE.md - System architecture"
echo "   PROJECT_SUMMARY.md - Complete feature list"
echo ""
echo "🎉 Happy coding!"
