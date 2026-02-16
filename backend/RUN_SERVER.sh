#!/bin/bash
# CMC Marketplace - Run Backend Server

echo "🚀 Starting CMC Marketplace Backend..."
echo "======================================"

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Run: python3 -m venv venv"
    exit 1
fi

# Activate venv
source venv/bin/activate

# Check if dependencies installed
if ! python -c "import fastapi" 2>/dev/null; then
    echo "❌ Dependencies not installed!"
    echo "Run: pip install -r requirements.txt"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Copy .env.example to .env and configure it"
    exit 1
fi

echo "✅ Virtual environment activated"
echo "✅ Dependencies installed"
echo "✅ Environment configured"
echo ""
echo "Starting server on http://localhost:8000"
echo "API docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop"
echo "======================================"
echo ""

# Run server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
