FROM git.zarantonello.dev/infra/ci-pnpm:v1.0.0@sha256:d6119c2fbece2b90644fed77bae5065281ca460ac12d52b5e5909e0ac4519bf7

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
