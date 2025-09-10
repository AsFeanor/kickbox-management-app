#!/bin/bash

# Railway'de SQLite database'i için volume setup
echo "Setting up SQLite database for Railway deployment..."

# Create data directory if it doesn't exist
mkdir -p /app/data

# Set DATABASE_URL to use volume-mounted path
export DATABASE_URL="file:/app/data/production.db"

# Run Prisma migrations
cd backend
npx prisma migrate deploy

echo "Database setup complete!"
