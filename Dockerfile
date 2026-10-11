# Multi-stage production container for SkillSafe VR (Node.js + Python FastAPI)
FROM python:3.11-slim

# Install Node.js 20 & build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    build-essential \
    libpq-dev \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Install Node.js dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application files
COPY . .

# Environment defaults
ENV PORT=3000 \
    FASTAPI_URL=http://127.0.0.1:8000 \
    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/skillsafe \
    NODE_ENV=production

EXPOSE 3000

# Start script running both FastAPI on :8000 and Node Express on :$PORT
CMD ["sh", "-c", "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 & node server.js"]
