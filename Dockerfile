# Use the official Node.js LTS image
# See all versions at https://hub.docker.com/_/node
FROM oven/bun AS base
WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y cron curl && \
    rm -rf /var/lib/apt/lists/*


RUN echo "* */24 * * * root curl -s https://localhost:${PORT:=3001}/cleanup > /var/log/cron.log 2>&1" > /etc/cron.d/cleanup && \
    chmod 0644 /etc/cron.d/cleanup && \
    touch /var/log/cron.log && \
    chown root:root /var/log/cron.log && \
    chmod 644 /var/log/cron.log

FROM base AS bun
RUN curl -fsSL https://bun.sh/install | bash

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install

RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock drizzle.config.ts drizzle /temp/prod/
RUN cd /temp/prod && bun i --only=production

# Copy node_modules from temp directory
# Then copy all (non-ignored) project files into the image
FROM base AS prerelease

ENV PUBLIC_FEATURE_MARKETING_PAGES="off"

COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
#RUN npm test
RUN bun run build

# Copy production dependencies and source code into final image
FROM base AS release

USER root

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/build .
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/drizzle.config.ts .
COPY --from=prerelease /usr/src/app/drizzle ./drizzle

RUN mkdir -p /data
ENV DATABASE_URL="file:/data/shrt-container.db"
ENV PORT=3001

EXPOSE 3001/tcp

COPY --chmod=755 <<EOT /entrypoint.sh
#!/usr/bin/env bash
set -e
if ! [ -e /data/shrt-container.db ]; then
    touch /data/shrt-container.db
fi
chown -R bun:bun /data

exec su bun -c "bunx drizzle-kit migrate --config=drizzle.config.ts && bun ./index.js"
EOT

ENTRYPOINT ["/entrypoint.sh"]
