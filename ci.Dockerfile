FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.11@sha256:7c17478b9da547ffd0494a91fcb2eff8a84e3e98953771c82efdccbd744492eb

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.11.4"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
