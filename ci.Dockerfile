FROM git.zarantonello.dev/infra/ci-pnpm:v2026.11.08.1@sha256:33059a9f1371d47f502bab672de35bbc15da76872aa17e03efe6fd916067f8ca

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
