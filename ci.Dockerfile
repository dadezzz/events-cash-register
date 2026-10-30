FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.26@sha256:b8ccd4eb2ec4aab662d0bab42ebc05c59ca00fff4eb969d2d57b6242a3473bd9

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.11.10"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
