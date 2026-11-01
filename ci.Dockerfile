FROM git.zarantonello.dev/infra/ci-pnpm:v2026.10.31.1@sha256:e6e09a4058631c647b9c03b77b3e1877d251f809296f6b9252700d4d8ce108be

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
