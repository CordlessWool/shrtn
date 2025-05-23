#!/bin/bash

set -e

bun run build:cloudflare
#bunx wrangler d1 delete SHRTN_D1 --local --env citest
bun run db:migrate:cloudflare --local --env citest
nohub bun wrangler dev --port 4173 --local --env citest > /dev/null 2>&1 &

SERVER_PID=$!
trap 'echo "🛑 Killing server (PID $SERVER_PID)"; kill $SERVER_PID' EXIT

# Wait for it to be ready
until curl --silent --output /dev/null --fail http://localhost:4173; do
  sleep 30
done

bun playwright test $@
