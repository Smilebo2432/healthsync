#!/bin/bash

echo "🚀 Starting HealthSync AI..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

# Start backend
echo "🔧 Starting backend server..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Start backend server in background
echo "🚀 Starting backend on http://localhost:5001"
python app.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd ../frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Start frontend
echo "🚀 Starting frontend on http://localhost:3000"
npm start &
FRONTEND_PID=$!

echo "✅ HealthSync AI is starting up!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait

# Cleanup
echo "🛑 Stopping servers..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "✅ Servers stopped"
