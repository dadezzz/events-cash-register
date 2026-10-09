FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.17@sha256:ef6e3eef8f44d9c2708fc215e1a78efc05c7f961f8fef09c5f1d97374fd05b97

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.11.7"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
