#!/bin/bash

set -e
rm -f test-smtp.db
DATABASE_URL=file:test-smtp.db
bun run build
bun run db:migrate
bun run preview &
SERVER_PID=$!
echo $SERVER_PID

# Wait for it to be ready
until curl --silent --output /dev/null --fail http://localhost:4173; do
  sleep 3
done

bun playwright test e2e/login.test.ts
kill $SERVER_PID
