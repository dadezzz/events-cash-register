FROM docker.io/library/node:26.5.1-alpine@sha256:233761595746769ebfdb6090f44fc7cdf818ae0ce62d2b37e0367723b9823e36

# Lines:
# 1. dev tools
# 2. cups package build deps
# 4. chromium for puppeteer
RUN apk add --no-cache \
    git \
    cups-dev curl g++ clang-extra-tools meson \
    chromium

# renovate: datasource=npm depName=pnpm versioning=npm
ENV PNPM_VERSION="11.17.0"

RUN --mount=type=cache,sharing=locked,target=/root/.npm npm install -g "pnpm@$PNPM_VERSION"

ENV PATH="/usr/local/pnpm/bin:$PATH"
ENV PNPM_HOME="/usr/local/pnpm"

RUN pnpm config set store-dir /usr/local/pnpm/store
