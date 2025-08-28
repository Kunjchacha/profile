# 🚀 Profile Website Deployment Script
# This script helps you deploy updates to your portfolio website

Write-Host "🚀 Starting Profile Website Deployment..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "index.html")) {
    Write-Host "❌ Error: index.html not found. Please run this script from the PROFILE directory." -ForegroundColor Red
    exit 1
}

# Check git status
Write-Host "📊 Checking git status..." -ForegroundColor Yellow
$status = git status --porcelain

if ($status) {
    Write-Host "📝 Changes detected. Adding files..." -ForegroundColor Yellow
    git add .
    
    $commitMessage = Read-Host "💬 Enter commit message (or press Enter for default)"
    if (-not $commitMessage) {
        $commitMessage = "Update portfolio content - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    
    git commit -m $commitMessage
    
    Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    
    Write-Host "✅ Deployment completed!" -ForegroundColor Green
    Write-Host "🌐 Your website will be updated at: https://kunjchacha.github.io/profile" -ForegroundColor Cyan
    Write-Host "⏱️  Please wait 2-5 minutes for changes to appear." -ForegroundColor Yellow
} else {
    Write-Host "✅ No changes detected. Everything is up to date!" -ForegroundColor Green
}

Write-Host "`n📚 Next steps:" -ForegroundColor Cyan
Write-Host "1. Visit https://kunjchacha.github.io/profile to see your website" -ForegroundColor White
Write-Host "2. Check GitHub Actions for deployment status" -ForegroundColor White
Write-Host "3. Set up Notion integration for easy content updates" -ForegroundColor White
