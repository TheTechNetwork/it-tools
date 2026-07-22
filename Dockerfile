# syntax=docker/dockerfile:1
#
# Three image variants share one build stage. Build a specific one with
# `docker build --target <standard|rootless|distroless> .`; a plain
# `docker build .` produces the standard image (the last stage) for backward
# compatibility. All three serve the same built app with identical behaviour
# (gzip, security headers, immutable asset caching, no-cache SPA shell, SPA
# fallback) - verified by the docker-image CI job.

# ---------------------------------------------------------------------------
# Shared build stage: install dependencies and build the static app once.
# ---------------------------------------------------------------------------
FROM node:lts-alpine@sha256:a0b9bf06e4e6193cf7a0f58816cc935ff8c2a908f81e6f1a95432d679c54fbfd AS build-stage
ENV NPM_CONFIG_LOGLEVEL=warn
ENV CI=true
WORKDIR /app

RUN corepack enable

# Copy only dependency files first for better layer caching.
# pnpm-workspace.yaml carries the build-script approvals (allowBuilds) and
# .npmrc the pnpm settings, both needed for a clean --frozen-lockfile install.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm i --frozen-lockfile

# Copy source (changes frequently, placed after deps install) and build.
COPY . .
RUN pnpm build

# ---------------------------------------------------------------------------
# rootless: nginx-unprivileged. Runs as non-root (UID 101), listens on 8080
# (a non-root process cannot bind ports < 1024). Same nginx config as standard,
# only the templated listen port differs.
# ---------------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:stable-alpine@sha256:44e36330f74d4f3a1d4e222acca9e23b401fb87811a7597024502bb759c4dd49 AS rootless
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
ENV NGINX_PORT=8080
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1

# ---------------------------------------------------------------------------
# distroless: static-web-server on a scratch base. No shell or package manager;
# runs as non-root and listens on 8080. There is no shell for a Docker
# HEALTHCHECK - use an orchestrator HTTP readiness/liveness probe against
# http://<host>:8080/ instead. Serving behaviour matches the nginx variants via
# docker/sws.toml.
# ---------------------------------------------------------------------------
FROM joseluisq/static-web-server:2@sha256:6acea6260b14e08dda986361e42640082fbfaab8d88c327de532bb13a3b22994 AS distroless
COPY --from=build-stage /app/dist /public
COPY docker/sws.toml /etc/sws.toml
USER 65534:65534
EXPOSE 8080
CMD ["-w", "/etc/sws.toml"]

# ---------------------------------------------------------------------------
# standard (default target): stock nginx, runs as root, listens on 80. Kept as
# the default so existing `docker build .` / `:latest` users are unaffected.
# ---------------------------------------------------------------------------
FROM nginx:stable-alpine@sha256:97d490c12ba55b4946b01546d1c3ed324e8d41ab1c9fcb2a616aa470620e5b46 AS standard
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
ENV NGINX_PORT=80
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:80/ || exit 1
