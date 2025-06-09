# Use a slim Python image for the backend
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Set Flask environment variables
ENV FLASK_APP=run.py
ENV FLASK_ENV=development
ENV FLASK_RUN_PORT=8001

# Expose the port
EXPOSE 8001

# Run the Flask development server (replace with Gunicorn for production)
CMD ["flask", "run", "--host=0.0.0.0"]