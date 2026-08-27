FROM docker.io/library/node:26.8.1-alpine@sha256:2d984a15c9b54fd0aeb608b8e0d0d83529eb34d2966db27a1fb4f1edc3d298a3

# Lines:
# 1. dev tools
# 2. cups package build deps
# 4. chromium for puppeteer
RUN apk add --no-cache \
    git \
    cups-dev curl g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=pnpm versioning=npm
ENV PNPM_VERSION="11.24.0"
# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.10.11"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "pnpm@$PNPM_VERSION" "turbo@$TURBO_VERSION"

ENV PATH="/usr/local/pnpm/bin:$PATH"
ENV PNPM_HOME="/usr/local/pnpm"

RUN pnpm config set store-dir /usr/local/pnpm/store
