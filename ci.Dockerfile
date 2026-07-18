FROM docker.io/library/node:26.5.0-alpine@sha256:e88a35be04478413b7c71c455cd9865de9b9360e1f43456be5951032d7ac1a66

# Lines:
	# 1. dev tools
	# 2. cups package build deps
	# 4. chromium for puppeteer
	RUN apk add --no-cache \
	    git \
	    cups-dev curl g++ clang-extra-tools meson \
	    chroumium

# renovate: datasource=npm depName=pnpm versioning=npm
ENV PNPM_VERSION="11.13.0"

RUN --mount=type=cache,sharing=locked,target=/root/.npm npm install -g "pnpm@$PNPM_VERSION"

ENV PATH="/usr/local/pnpm/bin:$PATH"
ENV PNPM_HOME="/usr/local/pnpm"

RUN pnpm config set store-dir /usr/local/pnpm/store
