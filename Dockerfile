# Optimized Flask Backend Dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY optimized_app.py /app
COPY requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "optimized_app:app"]