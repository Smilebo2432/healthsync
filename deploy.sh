#!/bin/bash

# HealthSync AI Deployment Script
# This script helps set up and run the HealthSync AI application

set -e

echo "🚀 HealthSync AI - Deployment Script"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the HealthSync AI root directory"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists python3; then
    echo "❌ Python 3 is required but not installed"
    echo "   Please install Python 3.8+ and try again"
    exit 1
fi

if ! command_exists pip3; then
    echo "❌ pip3 is required but not installed"
    echo "   Please install pip3 and try again"
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is required but not installed"
    echo "   Please install Node.js 16+ and try again"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is required but not installed"
    echo "   Please install npm and try again"
    exit 1
fi

echo "✅ All prerequisites are satisfied"

# Backend setup
echo ""
echo "🐍 Setting up Python backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "   Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "   Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "   Installing Python dependencies..."
pip install -r requirements.txt

# Check for .env file
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  No .env file found in backend directory"
    echo "   Please create a .env file with your Gemini API key:"
    echo "   GEMINI_API_KEY=your_api_key_here"
    echo ""
    echo "   You can copy from env.example:"
    echo "   cp env.example .env"
    echo ""
    read -p "   Press Enter to continue (you'll need to create .env file manually)..."
else
    echo "✅ Environment file found"
fi

cd ..

# Frontend setup
echo ""
echo "⚛️  Setting up React frontend..."
cd frontend

# Install dependencies
echo "   Installing Node.js dependencies..."
npm install

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To run the application:"
echo ""
echo "1. Start the backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python run.py"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Open your browser to: http://localhost:3000"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "Happy coding! 🚀"
