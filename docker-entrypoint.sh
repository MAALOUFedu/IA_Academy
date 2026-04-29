#!/bin/sh
set -e

echo "🚀 Starting ML Training Platform..."

# Step 1: Initialize database schema
echo "📋 Initializing database schema..."
npx prisma db push --skip-generate 2>&1
echo "✅ Database schema initialized"

# Step 2: Check if we need to seed data
echo "🌱 Checking if seed data is needed..."
TP_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.tP.count().then(c => { console.log(c); return prisma.\$disconnect(); }).catch(e => { console.log('0'); return prisma.\$disconnect(); });
" 2>/dev/null || echo "0")

if [ "$TP_COUNT" = "0" ] || [ -z "$TP_COUNT" ]; then
  echo "🌱 Seeding database with default TPs..."
  npx tsx /app/prisma/seed.ts 2>&1 || echo "⚠️ Seed failed, continuing anyway..."
  echo "✅ Seed completed"
else
  echo "✅ Database already has $TP_COUNT TPs, skipping seed"
fi

# Step 3: Start the Next.js server
echo "🎯 Starting Next.js server on port ${PORT:-7860}..."
exec node server.js
