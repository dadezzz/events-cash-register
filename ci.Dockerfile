FROM git.zarantonello.dev/infra/ci-pnpm:v2026.11.16.1@sha256:fca4850b77d324fab677b72afb463323e7e16f2e15c5e0c06486f1acd3406ca3

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
