FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.25@sha256:12a59f9245e34d7388f3309f5994f999ba345b9ccccdcfbda86dabe359dfca70

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
