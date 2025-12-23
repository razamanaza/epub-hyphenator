# syntax=docker/dockerfile:1

# ========================================
# Base Stage: Setup and user creation
# ========================================
FROM node:22-alpine AS base

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Set working directory and permissions
WORKDIR /app
RUN chown -R nodejs:nodejs /app

# ========================================
# Dependencies Stage: Install production dependencies
# ========================================
FROM base AS deps

# Copy package files first for better caching
COPY --chown=nodejs:nodejs package*.json ./

# Install production dependencies with cache mount for faster builds
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --omit=dev --no-audit --no-fund && \
    npm cache clean --force

# Set proper ownership
RUN chown -R nodejs:nodejs /app

# ========================================
# Build Stage: Build the application
# ========================================
FROM base AS build

# Copy production dependencies from deps stage
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nodejs:nodejs /app/package*.json ./

# Copy source code
COPY --chown=nodejs:nodejs . .

# Build the application
RUN npm run build

# Set proper ownership
RUN chown -R nodejs:nodejs /app

# ========================================
# Production Stage: Final runtime image
# ========================================
FROM base AS production

# Set production environment
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=256 --no-warnings" \
    NPM_CONFIG_LOGLEVEL=silent

# Copy package files first
COPY --chown=nodejs:nodejs package*.json ./

# Install production dependencies and epub-hyphen globally with Russian language support
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --omit=dev --no-audit --no-fund && \
    npm install -g epub-hyphen hyphenation.ru && \
    npm cache clean --force


# Copy built application from build stage
COPY --from=build --chown=nodejs:nodejs /app/.output ./.output

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["node", ".output/server/index.mjs"]
