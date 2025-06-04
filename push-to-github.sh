#!/bin/bash
# Usage: ./push-to-github.sh <your_github_username>

REPO_URL="https://github.com/$1/coinbase-movers.git"

git init
git remote add origin $REPO_URL
git add .
git commit -m "Initial fullstack commit with real-time Coinbase backend"
git branch -M main
git push -f origin main
