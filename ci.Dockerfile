FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.8@sha256:e124501d6e8f1e75bb10e9c0e4198f220d37d02c860866ce07e21c87bc6bb886

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.10.13"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
