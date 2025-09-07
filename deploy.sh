#!/bin/bash

# Shell deployment script for Webume Portfolio
# This script helps with local testing and deployment preparation

echo "🚀 Webume Portfolio - Deployment Script"
echo "====================================="

# Check if Node.js is installed
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js version: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start local development server
echo "🌐 Starting local development server..."
echo "📱 Open your browser and navigate to: http://localhost:3000"
echo "⏹️  Press Ctrl+C to stop the server"

npm start
