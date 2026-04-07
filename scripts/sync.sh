#!/bin/bash

# ARIA Git Sync Helper Script
# Usage: ./scripts/sync.sh "Commit Message" [Tag Value]

COMMIT_MSG=$1
TAG_VAL=$2

if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="[ARIA] Update: $(date +'%Y-%m-%d %H:%M:%S')"
fi

echo "🚀 Adding changes..."
git add .

echo "📝 Committing with message: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

echo "📡 Pushing to origin main..."
git push origin main

if [ ! -z "$TAG_VAL" ]; then
  echo "🏷 Creating and pushing tag: $TAG_VAL"
  git tag "$TAG_VAL"
  git push origin "$TAG_VAL"
fi

echo "✅ Sync complete!"
