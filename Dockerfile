# Make sure the .env file is configured before building the application. Some
# variables will be used for prerendering and build time substitution.

FROM git.zarantonello.dev/projects/events-cash-register-ci:v2026.08.27.1@sha256:b882489adbd3ab1a8b0d1a45e89801bbcbed8747320eb69970ef3241b0a36f4c AS pruner

WORKDIR /srv

COPY . .
RUN turbo prune --docker @workspace/root

FROM git.zarantonello.dev/projects/events-cash-register-ci:v2026.08.27.1@sha256:b882489adbd3ab1a8b0d1a45e89801bbcbed8747320eb69970ef3241b0a36f4c AS builder

WORKDIR /srv

COPY --from=pruner /srv/out/json .
RUN --mount=type=cache,sharing=locked,target=/usr/local/pnpm/store pnpm install
COPY --from=pruner /srv/out/full .

# Data is needed to run db commands during build, then it is discarded.
RUN mkdir data && turbo run build && rm -r data

RUN --mount=type=cache,sharing=locked,target=/usr/local/pnpm/store pnpm deploy --prod --filter @workspace/root out

FROM docker.io/library/node:26.7.0-alpine@sha256:aadf416b2cdce311a8811ba3f0608a61b77dbf997500e2eafe781b51f6a0b019

RUN apk add --no-cache chromium

WORKDIR /srv

COPY migrations/ migrations/
COPY --from=builder /srv/out/ .

EXPOSE 3000

ENTRYPOINT ["node", "./dist"]
