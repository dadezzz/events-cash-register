FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.21@sha256:fbc515a4a572b7d74871c861f90105ff2e35f3fc1fcd673735df97b8fae48c8b

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
