FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.10@sha256:a77add72d38d0a17a3925880611b74bce4a7faa34c1ce91c8fdfbd3da3f866cc

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.11.3"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
