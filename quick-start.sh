#!/bin/bash

# AIgile Platform - Quick Start Script
# Automatically handles setup and launch

set -e

echo "═══════════════════════════════════════════════════════════════════"
echo "              AIgile Platform - Quick Start                         "
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Check if we're on the problematic T9 drive
if [[ "$PWD" == *"/Volumes/T9"* ]]; then
    echo "⚠️  WARNING: You're on /Volumes/T9 which has inode issues"
    echo ""
    echo "RECOMMENDED: Copy project to local disk first:"
    echo "  cp -r /Volumes/T9/aigile ~/aigile-local"
    echo "  cd ~/aigile-local"
    echo "  ./quick-start.sh"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    echo ""
    
    # Try npm install
    if npm install; then
        echo "✅ Dependencies installed successfully!"
    else
        echo ""
        echo "❌ npm install failed. Trying alternatives..."
        echo ""
        
        # Try with legacy peer deps
        if npm install --legacy-peer-deps; then
            echo "✅ Dependencies installed with legacy-peer-deps!"
        else
            echo ""
            echo "❌ Installation failed. This is likely due to:"
            echo "   1. Inode exhaustion (if on /Volumes/T9)"
            echo "   2. Insufficient permissions"
            echo "   3. Network issues"
            echo ""
            echo "Solutions:"
            echo "   • Copy project to another location (recommended)"
            echo "   • Try: yarn install"
            echo "   • Deploy directly to Vercel: vercel"
            echo ""
            exit 1
        fi
    fi
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "              Starting Development Server                           "
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "🚀 Launching on http://localhost:3000"
echo ""
echo "Features available:"
echo "  • AIgile Manifesto homepage"
echo "  • AI Retro Tool (/retro)"
echo "  • Theme toggle (Sarah/Maya)"
echo "  • Language toggle (EN/FR)"
echo ""
echo "Press Ctrl+C to stop"
echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Start dev server
npm run dev
