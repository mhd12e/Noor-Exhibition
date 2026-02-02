# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client
RUN npx prisma generate
# Use dummy DB for build
RUN DATABASE_URL=file:/tmp/build.db npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# The 'node' user already has UID/GID 1000 in node-alpine
# Just ensure the prisma directory exists and is owned by 'node'
RUN mkdir -p /app/prisma && chown -R node:node /app/prisma

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
# Ensure the local dev.db is copied into the image
COPY --from=builder --chown=node:node /app/prisma ./prisma

USER node

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
