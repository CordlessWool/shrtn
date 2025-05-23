#!/bin/bash

set -e
bun run build
bun run db:migrate
bun run preview &
SERVER_PID=$!
trap 'echo "🛑 Killing server (PID $SERVER_PID)"; kill $SERVER_PID' EXIT


# Wait for it to be ready
until curl --silent --output /dev/null --fail http://localhost:4173; do
  sleep 30
done

bun playwright test $@
