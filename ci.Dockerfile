FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.23@sha256:849f4f17f07acc2d2afe5c3589c61a7b435263b5d64f71eaa8bf9092001cbbc3

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.11.9"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
