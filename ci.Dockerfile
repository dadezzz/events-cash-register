FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.22@sha256:0d5d1309a0e583efc5568ce073b4183ba50a93c1945262500dfaab7edb493ad1

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.11.8"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
