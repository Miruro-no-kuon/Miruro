FROM oven/bun:latest
WORKDIR /usr/src/app

COPY . .
RUN bun install
RUN bun run build

ENV NODE_ENV=production

USER bun
EXPOSE 5173/tcp
ENTRYPOINT [ "bun", "run", "./server/server.ts" ]