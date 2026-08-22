#!/bin/bash
# Ahmed Badway — Setup Script
# Claude Code Web

echo "🌊 Setting up project..."

# 1. Fetch CLAUDE.md from GitHub
echo "📥 Loading CLAUDE.md..."
curl -s https://raw.githubusercontent.com/ahmedbadway/main/CLAUDE.md > CLAUDE.md

# 2. Install dependencies
if [ -f "package.json" ]; then
  echo "📦 Installing packages..."
  npm install
  npm install motion
  npm install -D @playwright/test
  echo "✅ Dependencies ready"
else
  echo "⚠️  No package.json — Claude Code will scaffold first"
fi

echo ""
echo "✅ Setup complete!"
echo "Run E2E tests: npm run test:e2e"
echo "Remember: Work on main branch only. No new branches."

