FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.1@sha256:ed87e9364a5448217835ebf4103ef275f15b0267a9580dec3ac716c1abaa0a26

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.10.12"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
