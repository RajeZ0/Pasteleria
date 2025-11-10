# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
RUN pnpm prune --prod

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup -g 1001 nodejs && adduser -D -G nodejs nodejs
USER nodejs
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 8080
ENV PORT=8080
CMD ["pnpm", "start"]
