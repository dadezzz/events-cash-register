FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.9@sha256:146dd0f65fc8297679f7078fa442b886652ae57e755359fca9b7dd9febb25088

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.11.2"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
