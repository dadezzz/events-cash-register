FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.2@sha256:c983897318782b8c272bbefee3701268cceda980a7c0d0c38c801f575a014a44

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
