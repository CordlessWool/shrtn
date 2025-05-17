#!/bin/bash

set -e

bun run build
bun run db:migrate
bun run preview &
SERVER_PID=$!

# Wait for it to be ready
until curl --silent --output /dev/null --fail http://localhost:4173; do
  sleep 1
done

bun playwright test
kill $SERVER_PID
