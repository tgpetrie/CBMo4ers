#!/bin/bash

echo "🔧 Setting up Python virtual environment..."
python3 -m venv venv

echo "📂 Activating virtual environment..."
source venv/bin/activate

echo "📦 Installing dependencies from requirements.txt..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Backend environment ready. To activate it later, run:"
echo "source venv/bin/activate"
