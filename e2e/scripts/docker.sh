#!/bin/bash
set -e

curl http://localhost:4173

# Wait for it to be ready
until curl --silent --output /dev/null --fail http://localhost:4173; do
  sleep 3
done

bun playwright test
