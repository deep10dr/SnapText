# Use the same Python version as your local machine
FROM python:3.12-slim

# Install Tesseract OCR and required system libraries
RUN apt-get update && apt-get install -y tesseract-ocr libgl1

# Set the working directory inside the container
WORKDIR /app

# Copy project files
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose FastAPI port
EXPOSE 8000

# Start FastAPI using Gunicorn + Uvicorn worker
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app"]
