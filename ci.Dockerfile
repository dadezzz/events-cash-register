FROM git.zarantonello.dev/infra/ci-pnpm:v1.0.1@sha256:cc0fe239caf067d0270705aad16089a25383a9e76e0b98aa5966164c8cb19984

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
