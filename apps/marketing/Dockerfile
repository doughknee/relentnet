# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/marketing/package.json apps/marketing/package.json

# motion-plus resolves from Motion's private registry. Coolify supplies build
# variables as --build-arg (not compose secrets), so auth arrives as an ARG.
# Safe for the shipped image: this build stage is discarded and the runtime
# stage's history never contains the token — it persists only in the build
# host's local cache. The guard turns a missing token into a clear error
# instead of npm's misleading "invalid token" E401.
ARG MOTION_TOKEN
RUN test -n "$MOTION_TOKEN" || { echo "MOTION_TOKEN build arg missing" >&2; exit 1; } && \
    npm config set "//api.motion.dev/npm/:_authToken" "$MOTION_TOKEN" && \
    npm ci && \
    npm config delete "//api.motion.dev/npm/:_authToken"

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
