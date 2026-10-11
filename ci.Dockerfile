FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.19@sha256:8c22923b6d32bebd769e7cf94fdcec9cab9c1f78a4e94c0dd36e715ad643a181

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
