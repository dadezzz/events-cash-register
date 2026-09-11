FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.3@sha256:79ec9cc67899b315e8857eeab03880bb7ee8b79e2a4d865657da85c7e1155ff8

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
