#!/bin/bash
# Quick rebuild script for development

echo "🛑 Stopping container..."
docker compose down

echo "🗑️  Removing old image..."
docker rmi static-site-web 2>/dev/null || true

echo "🔨 Building new image (no cache)..."
docker compose build --no-cache

echo "🚀 Starting container..."
docker compose up -d

echo "✅ Done! Site running at http://localhost:8080"
echo "📋 View logs: docker compose logs -f"
