# Make sure the .env file is configured before building the application. Some
# variables will be used for prerendering and build time substitution.

FROM git.zarantonello.dev/projects/events-cash-register-ci:v2026.11.08.1@sha256:1cf246f4448fa50f27346ff49934883e05b44a3cd93704c91733da27189f929f AS pruner

WORKDIR /srv

COPY . .
RUN turbo prune --docker @workspace/website

FROM git.zarantonello.dev/projects/events-cash-register-ci:v2026.11.08.1@sha256:1cf246f4448fa50f27346ff49934883e05b44a3cd93704c91733da27189f929f AS builder

WORKDIR /srv

COPY --from=pruner /srv/out/json .
RUN --mount=type=cache,sharing=locked,target=/usr/local/pnpm/store pnpm install

COPY --from=pruner /srv/out/full .
# Copy manually since turborepo prunes the .env.example and makes setup fail.
COPY .env.example .env.example
# Data is needed to run db commands during build, then it is discarded.
RUN mkdir data && turbo run build && rm -r data

RUN --mount=type=cache,sharing=locked,target=/usr/local/pnpm/store pnpm deploy --prod --filter @workspace/website out

FROM docker.io/library/node:26.13.0-alpine@sha256:8996bb5821d62a8fd9bb27c1cb07462f3fdce6e47d640c6a881ead0b064ce216

RUN apk add --no-cache chromium

WORKDIR /srv

COPY migrations/ migrations/
COPY --from=builder /srv/out/ .

EXPOSE 3000

ENTRYPOINT ["node", "./dist"]
