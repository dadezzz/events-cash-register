FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.20@sha256:b7504f9f971d7f52d1df3a56a95578a97e58372752dde61e2ae9b605901f5db0

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
