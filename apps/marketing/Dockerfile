# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/marketing/package.json apps/marketing/package.json

RUN npm ci

COPY . .
RUN npm run build -w @relentnet/marketing

FROM nginx:1.27-alpine AS runtime
COPY apps/marketing/nginx.conf /etc/nginx/conf.d/default.conf
# SPA-mode build emits the static client into dist/client (the dist/server
# bundle is only used at build time for prerendering — not shipped).
COPY --from=build /app/apps/marketing/dist/client /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1
