FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.7@sha256:35d75d27db7ed777a10cad500314c75e484b04f443b905e412079dd142f784b5

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.10.13"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
