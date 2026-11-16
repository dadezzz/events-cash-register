FROM git.zarantonello.dev/infra/ci-pnpm:v2026.11.15.1@sha256:a79c0d2a945bbec90576a17370f98e41a0c2c34280bca1dd09cefb0e8f59e571

# Lines:
# 1. cups package build deps
# 2. chromium for puppeteer
RUN apk add --no-cache \
    cups-dev g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=turbo versioning=npm
ENV TURBO_VERSION="2.11.11"

RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm install -g "turbo@$TURBO_VERSION"
