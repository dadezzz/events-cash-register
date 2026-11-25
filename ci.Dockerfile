FROM git.zarantonello.dev/infra/ci-pnpm:v2026.11.24.1@sha256:a0b6f90b5d57b45426b3cf851db5fdc13d30c733f986027d61e0dbbcbf789021

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.11.13"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
