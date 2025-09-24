# syntax=docker/dockerfile:1.7

# Multi-stage production build for Next.js (Pages Router) app
# - Uses Next's standalone output to minimize runtime image size
# - Avoids copying node_modules to the runtime stage
# - Supports injecting NEXT_PUBLIC_* at build-time (required by Next)

ARG NODE_VERSION=20

##############################
# 1) Base deps (for caching)
##############################
FROM --platform=linux/amd64 node:${NODE_VERSION}-slim AS deps
WORKDIR /app

# Ensure required system dependencies are present for certain npm packages.
RUN --mount=type=cache,target=/var/cache/apt \
    --mount=type=cache,target=/var/lib/apt/lists \
    apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    git \
    openssl \
 && rm -rf /var/lib/apt/lists/*

# Leverage Docker BuildKit cache for npm
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

##############################
# 2) Builder (compile Next app)
##############################
FROM --platform=linux/amd64 node:${NODE_VERSION}-slim AS builder
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/app/.next/cache \
    npm run build

##############################
# 3) Runner (minimal runtime)
##############################
FROM --platform=linux/amd64 node:${NODE_VERSION}-slim AS runner
WORKDIR /app


ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Use non-root user for security
RUN useradd --create-home --shell /bin/bash nextjs \
  && chown -R nextjs:nextjs /app
USER nextjs

# Copy the production standalone server and static assets
COPY --chown=nextjs:nextjs --from=builder /app/.next/standalone ./
COPY --chown=nextjs:nextjs --from=builder /app/.next/static ./.next/static
COPY --chown=nextjs:nextjs --from=builder /app/public ./public

EXPOSE 3000

# Start the Next.js standalone server
CMD ["node", "server.js"]

