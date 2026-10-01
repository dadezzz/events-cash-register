FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.12@sha256:1ca487478bd03c8273a730585ffebd951411988ee015693636de9534f8d02b31

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.11.5"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
