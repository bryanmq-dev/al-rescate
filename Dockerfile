# Based on the official Nuxt Docker example (content.nuxt.com/docs/deploy/docker)
FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

# .npmrc is optional (glob), pnpm-lock.yaml is required for --frozen-lockfile
COPY package.json pnpm-lock.yaml .npmrc* ./
RUN pnpm install --frozen-lockfile

COPY . ./
RUN pnpm run build

FROM node:22-alpine
WORKDIR /app

# Only `.output` is needed at runtime
COPY --from=build /app/.output/ ./

ENV PORT=80
ENV HOST=0.0.0.0
EXPOSE 80

CMD ["node", "/app/server/index.mjs"]
