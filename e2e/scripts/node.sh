#!/bin/bash

set -e
rm -f test-node.db
DATABASE_URL=file:test-node.db
bun run build
bun run db:migrate
bun run preview &
SERVER_PID=$!


# Wait for it to be ready
until curl --silent --output /dev/null --fail http://localhost:4173; do
  sleep 3
done

bun playwright test $@
kill -9 $SERVER_PID
