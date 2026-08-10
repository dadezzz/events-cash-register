FROM docker.io/library/node:26.7.0-alpine@sha256:aadf416b2cdce311a8811ba3f0608a61b77dbf997500e2eafe781b51f6a0b019

# Lines:
# 1. dev tools
# 2. cups package build deps
# 4. chromium for puppeteer
RUN apk add --no-cache \
    git \
    cups-dev curl g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=pnpm versioning=npm
ENV PNPM_VERSION="11.20.0"
# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.10.8"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "pnpm@$PNPM_VERSION" "turbo@$TURBO_VERSION"

ENV PATH="/usr/local/pnpm/bin:$PATH"
ENV PNPM_HOME="/usr/local/pnpm"

RUN pnpm config set store-dir /usr/local/pnpm/store
