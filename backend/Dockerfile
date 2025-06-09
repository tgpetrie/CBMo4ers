# Use the official image as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8000 available instead of 5000
EXPOSE 8000

# Define environment variable
ENV FLASK_APP wsgi.py

# Run app via Gunicorn on 0.0.0.0:8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "wsgi:app"]
