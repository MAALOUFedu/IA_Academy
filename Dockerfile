# =============================================================================
# Dockerfile — ML Training Platform pour HuggingFace Spaces (Docker SDK)
# =============================================================================
# Build: docker build -t ml-training-platform .
# Run:   docker run -p 7860:7860 ml-training-platform
# =============================================================================

# --- Stage 1: Dependencies ---
FROM node:20-alpine AS deps

WORKDIR /app

# Install system dependencies for sharp (image processing) and Prisma
RUN apk add --no-cache libc6-compat openssl

# Copy package files
COPY package.json bun.lock ./

# Install bun and dependencies
RUN npm install -g bun && bun install --frozen-lockfile

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client (pinned version to avoid CLI/client mismatch)
RUN bunx prisma@6 generate

# --- Stage 2: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat openssl

# Copy package files
COPY package.json bun.lock ./
RUN npm install -g bun && bun install --frozen-lockfile

# Copy all source files
COPY . .

# Generate Prisma client (pinned version)
RUN bunx prisma@6 generate

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js
RUN bun run build

# --- Stage 3: Production ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=7860
ENV HOSTNAME="0.0.0.0"

# Install system dependencies for runtime
RUN apk add --no-cache libc6-compat openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output from build stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma schema, generated client, and CLI from builder
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma/
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma/
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma/

# Install ONLY prisma CLI pinned to v6 (matches @prisma/client v6.x)
# NO tsx needed — seed script uses plain Node.js
RUN npm install -g prisma@6

# Create writable directories
RUN mkdir -p /app/data /app/uploads/notebooks && chown -R nextjs:nodejs /app/data /app/uploads

# Default database URL (can be overridden via HuggingFace Secrets)
ENV DATABASE_URL="file:/app/data/ml-academy.db"

# Default admin password (CHANGE THIS in HuggingFace Secrets!)
ENV ADMIN_PASSWORD="ml-admin-2024"

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Switch to non-root user
USER nextjs

EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:7860/ || exit 1

# Use entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
