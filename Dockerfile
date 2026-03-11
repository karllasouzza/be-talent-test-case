# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --frozen-lockfile

# Copy source and compile TypeScript
COPY . .
RUN node ace build

# ─── Stage 2: Production ─────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# The build output already contains a package.json and yarn.lock
COPY --from=builder /app/build .

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

EXPOSE 3333

# Run migrations then start the server
CMD sh -c "node ace migration:run --force && node bin/server.js"
