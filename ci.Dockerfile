FROM git.zarantonello.dev/infra/ci-pnpm:v1.1.15@sha256:4bd098a2dab95c5954b316de2170042c0f1441586933f249bad38f183a91858d

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
