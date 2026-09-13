FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.4@sha256:7e49fb9a710190a935f7fb3f80e66b43c73b471120ed6a4d64d125ab1ce7f44a

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
