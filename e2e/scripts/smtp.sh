#!/bin/bash

set -e

bun run build
bun run db:migrate
bun run preview &
SERVER_PID=$!
echo $SERVER_PID

trap 'echo "🛑 Killing server (PID $SERVER_PID)"; kill $SERVER_PID' EXIT

# Wait for it to be ready
until curl --silent --output /dev/null --fail http://localhost:4173/login; do
  sleep 3
done

bun playwright test e2e/login.test.ts
