#!/bin/bash

set -e

bun run build:cloudflare
bun run db:migrate:cloudflare --local
bun wrangler dev --port 4173 --local &

SERVER_PID=$!

# Wait for it to be ready
until curl --silent --output /dev/null --fail http://localhost:4173; do
  sleep 3
done

bun playwright test
kill $SERVER_PID
