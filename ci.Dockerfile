FROM git.zarantonello.dev/infra/ci-pnpm:v2026.11.06.1@sha256:ac3fc21c248e945a6250ceed8cd20b837458f5193edbb14cf34b50cd35c25586

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.11.10"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
