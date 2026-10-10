FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.18@sha256:437703240d77fe157c31f97cbb94a9c7fe124d9bd575a9b6e7aad2c8a30f7c83

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
