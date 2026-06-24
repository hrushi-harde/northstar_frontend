# ─────────────────────────────────────────────────────────────
# Stage 1 — build
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifests first for better layer caching
COPY package.json package-lock.json ./

# Install all deps (including devDependencies — needed for vite build)
RUN npm ci

# Copy source
COPY . .

# VITE_API_URL must be passed at build time via --build-arg
# e.g. docker build --build-arg VITE_API_URL=https://api.yourapp.com ...
ARG VITE_API_URL=http://localhost:3001/api
ENV VITE_API_URL=$VITE_API_URL

# Build the static bundle
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 2 — serve with nginx
# ─────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config — handles React Router (client-side routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
