FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.14@sha256:eab15584dc5a8c81bae62012fa6ce7926033796563f72c953f8ca86580e199fe

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
