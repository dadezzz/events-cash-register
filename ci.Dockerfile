FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.16@sha256:9ccb428c42c44d93dcd6375f3e1ccd8f37811d8d85bcb21bd618564efda002e7

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
