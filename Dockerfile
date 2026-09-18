# Make sure the .env file is configured before building the application. Some
# variables will be used for prerendering and build time substitution.

FROM git.zarantonello.dev/projects/events-cash-register-ci:v2026.09.13.1@sha256:2a5c5018ea859a8032735a065ddb47faa4e2ca3a87e3cee1147b042812ae063b AS pruner

WORKDIR /srv

COPY . .
RUN turbo prune --docker @workspace/website

FROM git.zarantonello.dev/projects/events-cash-register-ci:v2026.09.13.1@sha256:2a5c5018ea859a8032735a065ddb47faa4e2ca3a87e3cee1147b042812ae063b AS builder

WORKDIR /srv

COPY --from=pruner /srv/out/json .
RUN --mount=type=cache,sharing=locked,target=/usr/local/pnpm/store pnpm install

COPY --from=pruner /srv/out/full .
# Copy manually since turborepo prunes the .env.example and makes setup fail.
COPY .env.example packages/website/.env
# Data is needed to run db commands during build, then it is discarded.
RUN mkdir data && turbo run build && rm -r data

RUN --mount=type=cache,sharing=locked,target=/usr/local/pnpm/store pnpm deploy --prod --filter @workspace/website out

FROM docker.io/library/node:26.9.0-alpine@sha256:dbaa92e5758cbbcf85d65d5403fdb530fe3442cbe8c6dbfb7ef23365450d5070

RUN apk add --no-cache chromium

WORKDIR /srv

COPY migrations/ migrations/
COPY --from=builder /srv/out/ .

EXPOSE 3000

ENTRYPOINT ["node", "./dist"]
