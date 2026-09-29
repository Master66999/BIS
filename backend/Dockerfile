FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Initialize DB and start server
EXPOSE 8000

CMD ["sh", "-c", "python scripts/seed_database.py && uvicorn backend.main:app --host 0.0.0.0 --port 8000"]
