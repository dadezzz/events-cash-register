FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.24@sha256:f7dedfe380930fa57436efcfe3c4ac1fde639a296ad4e8806406ae7b2f573510

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
