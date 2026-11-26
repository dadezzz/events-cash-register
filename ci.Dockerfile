FROM git.zarantonello.dev/infra/ci-pnpm:v2026.11.26.1@sha256:bc2104d05e2ce9079d191f6c27d078cd107dc98e8ff0e4030083c9c1d27a8f16

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.11.13"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
