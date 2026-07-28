# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/proposals/package.json apps/proposals/package.json

RUN npm ci

COPY . .
RUN npm run build -w @relentnet/proposals

# Runtime: the Hono server serves the API and the built SPA from one
# container. Node 24 runs the TypeScript server sources natively (type
# stripping), so there is no transpile step and no nginx.
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=80 \
    DATA_DIR=/data

COPY package.json package-lock.json ./
COPY apps/proposals/package.json apps/proposals/package.json
RUN npm ci --omit=dev --workspace @relentnet/proposals --ignore-scripts

COPY apps/proposals/server apps/proposals/server
COPY apps/proposals/shared apps/proposals/shared
COPY --from=build /app/apps/proposals/dist apps/proposals/dist

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1
CMD ["node", "apps/proposals/server/main.ts"]
