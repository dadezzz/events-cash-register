# Make sure the .env file is configured before building the application. Some
# variables will be used for prerendering and build time substitution.

FROM git.zarantonello.dev/projects/events-cash-register-ci:v2026.09.03.1@sha256:f5be727992b2441db55434ded25dec5528a7ea1ae73201ea7188fd0b0506820f AS pruner

WORKDIR /srv

COPY . .
RUN turbo prune --docker @workspace/website

FROM git.zarantonello.dev/projects/events-cash-register-ci:v2026.09.03.1@sha256:f5be727992b2441db55434ded25dec5528a7ea1ae73201ea7188fd0b0506820f AS builder

WORKDIR /srv

COPY --from=pruner /srv/out/json .
RUN --mount=type=cache,sharing=locked,target=/usr/local/pnpm/store pnpm install

COPY --from=pruner /srv/out/full .
# Copy manually since turborepo prunes the .env.example and makes setup fail.
COPY .env.example packages/website/.env
# Data is needed to run db commands during build, then it is discarded.
RUN mkdir data && turbo run build && rm -r data

RUN --mount=type=cache,sharing=locked,target=/usr/local/pnpm/store pnpm deploy --prod --filter @workspace/website out

FROM docker.io/library/node:26.8.1-alpine@sha256:2d984a15c9b54fd0aeb608b8e0d0d83529eb34d2966db27a1fb4f1edc3d298a3

RUN apk add --no-cache chromium

WORKDIR /srv

COPY migrations/ migrations/
COPY --from=builder /srv/out/ .

EXPOSE 3000

ENTRYPOINT ["node", "./dist"]
