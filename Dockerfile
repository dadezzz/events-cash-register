# Make sure the .env file is configured before building the application. Some
# variables will be used for prerendering and build time substitution.

FROM git.zarantonello.dev/projects/events-cash-register-ci:v2026.10.24.1@sha256:5685c9e836de08ef35b3ea558fb0bf8727c47d9cc7eb7ddd3042b62527971c4e AS pruner

WORKDIR /srv

COPY . .
RUN turbo prune --docker @workspace/website

FROM git.zarantonello.dev/projects/events-cash-register-ci:v2026.10.24.1@sha256:5685c9e836de08ef35b3ea558fb0bf8727c47d9cc7eb7ddd3042b62527971c4e AS builder

WORKDIR /srv

COPY --from=pruner /srv/out/json .
RUN --mount=type=cache,sharing=locked,target=/usr/local/pnpm/store pnpm install

COPY --from=pruner /srv/out/full .
# Copy manually since turborepo prunes the .env.example and makes setup fail.
COPY .env.example packages/website/.env
# Data is needed to run db commands during build, then it is discarded.
RUN mkdir data && turbo run build && rm -r data

RUN --mount=type=cache,sharing=locked,target=/usr/local/pnpm/store pnpm deploy --prod --filter @workspace/website out

FROM docker.io/library/node:26.12.1-alpine@sha256:40cd011b55415bc894e45b02fdd5a5dfde056921b7d23a64c74f80497af48797

RUN apk add --no-cache chromium

WORKDIR /srv

COPY migrations/ migrations/
COPY --from=builder /srv/out/ .

EXPOSE 3000

ENTRYPOINT ["node", "./dist"]
