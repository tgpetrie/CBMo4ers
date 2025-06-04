#!/bin/bash
# Start Flask app with Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 optimized_app:app
