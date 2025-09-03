# PowerShell deployment script for Webume Portfolio
# This script helps with local testing and deployment preparation

Write-Host "🚀 Webume Portfolio - Deployment Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Start local development server
Write-Host "🌐 Starting local development server..." -ForegroundColor Yellow
Write-Host "📱 Open your browser and navigate to: http://localhost:3000" -ForegroundColor Cyan
Write-Host "⏹️  Press Ctrl+C to stop the server" -ForegroundColor Gray

npm start
