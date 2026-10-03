FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.13@sha256:a10e188c33c78648a4337fc626bd73b9e720cf0364352756fa6167cdb6d3814a

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.11.5"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
