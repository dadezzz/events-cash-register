FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.5@sha256:d4011284a8cc8c627f8a3f94b8381b0ffaf1caff744c3ce5c9b64075553224ba

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
